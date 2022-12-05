import {
  Button,
  Form,
  TextInput,
  Notification,
  Subheading,
  SectionHeading,
  Icon,
  Tooltip,
  Paragraph,
} from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import ImgixAPI, { APIError } from 'imgix-management-js';
import { debounce } from 'lodash';
import { ChangeEvent, Component } from 'react';

import {
  invalidApiKeyError,
  IxError,
  noOriginAssetsError,
  noOriginAssetsWebFolderError,
  noSearchAssetsError,
  noSourcesError,
} from '../../helpers/errors';
import { AppInstallationParameters } from '../ConfigScreen/';
import { ImageGallery } from '../Gallery/';
import { Note } from '../Note/';
import { SourceSelect } from '../SourceSelect/';
import { DialogHeader } from './';

import packageJson from '../../../package.json';
import { UploadButton } from '../UploadButton/UploadButton';
import './Dialog.css';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

export interface AssetProps {
  src: string;
  attributes: Record<string, any>;
}

interface DialogState {
  imgix: ImgixAPI;
  isOpen: boolean;
  allSources: Array<SourceProps>;
  selectedSource: Partial<SourceProps>;
  page: PageProps;
  verified: boolean; // if API key is verified
  searchTerm?: string;
  assets: AssetProps[];
  errors: IxError[]; // array of IxErrors if any
  isSearching: boolean;
  isUploading: boolean;
  loading: boolean;
  showUpload: boolean;
  uploadForm: {
    file?: File;
    filename?: string;
    source?: {
      id?: string;
      name?: string;
      domain?: string;
    };
    destination?: string;
    previewSource?: string;
  };
}

export type PageProps = {
  currentIndex: number;
  totalPageCount: number;
};

export type SourceProps = {
  id: string;
  name: string;
  type: 'azure' | 'gcs' | 's3' | 'webfolder' | 'webproxy';
  domain: string;
};

type AppInvocationParameters = {
  selectedImage: {
    [key: string]: any;
  };
};

export default class Dialog extends Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);

    const installationParameters = props.sdk.parameters
      .installation as AppInstallationParameters;
    const apiKey = installationParameters.imgixAPIKey || '';
    const verified = !!installationParameters.successfullyVerified;
    const imgix = new ImgixAPI({
      apiKey,
      pluginOrigin: `contentful/v${packageJson.version}`,
    });

    this.state = {
      imgix,
      isOpen: false,
      allSources: [],
      selectedSource: {},
      page: {
        currentIndex: 0,
        totalPageCount: 1,
      },
      verified,
      searchTerm: '',
      assets: [],
      errors: [],
      isSearching: false,
      isUploading: false,
      loading: false,
      showUpload: false,
      uploadForm: {},
    };
  }

  getSources = async () => {
    return await this.state.imgix.request(
      'sources?sort=name&page[number]=0&page[size]=200',
    );
  };

  getSourceIDAndPaths = async (): Promise<Array<SourceProps>> => {
    let sources,
      enabledSources: Array<SourceProps> = [];

    try {
      sources = await this.getSources();
    } catch (error) {
      // APIError will emit more helpful data for debugging
      if (error instanceof APIError) {
        console.error(error.toString());
      } else {
        console.error(error);
      }
      return enabledSources;
    }

    /*
     * Resolved requests can either return an array of objects or a single
     * object via the `data` top-level field. When parsing all enabled sources,
     * both possibilities must be accounted for.
     */
    const sourcesArray = Array.isArray(sources.data)
      ? sources.data
      : [sources.data];
    enabledSources = sourcesArray.reduce(
      (result: SourceProps[], source: any) => {
        // TODO: add more explicit types for source
        if (
          source.attributes.enabled &&
          // filters out unsupported webproxy sources
          source.attributes.deployment.type !== 'webproxy'
        ) {
          const id = source.id;
          const name = source.attributes.name;
          const type = source.attributes.deployment.type;
          // there may be multiple domains, but we'll extract the first one for now
          let domain = source.attributes.deployment.imgix_subdomains[0];
          result.push({ id, name, type, domain });
        }
        return result;
      },
      [] as SourceProps[],
    );

    return enabledSources;
  };

  handleTotalImageCount = (totalImageCount: number, error: IxError) => {
    const totalPageCount = Math.ceil(totalImageCount / 18);
    let errors = [...this.state.errors];

    if (!totalPageCount) {
      errors.push(error);
    }

    return this.setState({
      page: {
        ...this.state.page,
        totalPageCount,
      },
      errors,
      loading: false,
    });
  };

  handlePageChange = (newPageIndex: number) =>
    this.setState({
      page: { ...this.state.page, currentIndex: newPageIndex },
    });

  debounceHandlePageChange = debounce(this.handlePageChange, 1000, {
    leading: true,
  });

  searchOnClick = () => {
    const { searchTerm } = this.state;

    this.setState(
      {
        page: {
          ...this.state.page,
          currentIndex: 0,
        },
        isSearching: true,
      },
      () => {
        const searchQuery = `?filter[or:categories]=${searchTerm}&filter[or:keywords]=${searchTerm}&filter[or:origin_path]=${searchTerm}&page[number]=${this.state.page.currentIndex}&page[size]=18`;
        searchTerm
          ? this.requestImageUrls(searchQuery)
          : this.requestImageUrls();
      },
    );
  };

  debounceSearchOnClick = debounce(this.searchOnClick, 1000, { leading: true });

  setSelectedSource = (source: SourceProps) => {
    this.setState({
      selectedSource: source,
      page: {
        currentIndex: 0,
        totalPageCount: 0,
      },
    });
  };

  resetNErrors = (n: number = 1) => {
    this.setState({ errors: this.state.errors.slice(n) });
  };

  async componentDidMount() {
    // If the API key is not valid do not attempt to load sources
    if (!this.state.verified) {
      this.setState({
        errors: [invalidApiKeyError()],
      });
      return;
    }
    try {
      const sources = await this.getSourceIDAndPaths();
      if (sources.length === 0) {
        throw noSourcesError();
      }
      // check if previously selected source exists
      // if it does, add it to state.
      const previouslySelectedSourceID = (
        this.props.sdk.parameters.invocation as AppInvocationParameters
      )?.selectedImage?.selectedSourceId;
      const selectedSource = sources.find((source: any) => {
        return source.id === previouslySelectedSourceID;
      });
      if (selectedSource) {
        this.setState({ allSources: sources, selectedSource });
      } else {
        this.setState({ allSources: sources });
      }
    } catch (error) {
      this.setState({ errors: [error] as IxError[] });
    }
  }

  getAndCountAssets = async (query: string, error: IxError) => {
    const assets = await this.state.imgix.request(
      `assets/${this.state.selectedSource?.id}${query}`,
    );
    // TODO: add more explicit types for image
    this.handleTotalImageCount(
      parseInt((assets.meta.cursor as any).totalRecords || 0),
      error,
    );
    return assets;
  };

  getAssetObjects = async (query: string, error: IxError) => {
    let assets,
      assetObjects: AssetProps[] = [];

    try {
      assets = await this.getAndCountAssets(query, error);
    } catch (error) {
      // APIError will emit more helpful data for debugging
      if (error instanceof APIError) {
        console.error(error.toString());
      } else {
        console.error(error);
      }
      return assetObjects;
    }

    /*
     * Resolved requests can either return an array of objects or a single
     * object via the `data` top-level field. When parsing all enabled sources,
     * both possibilities must be accounted for.
     */
    if (assets) {
      const assetsArray = Array.isArray(assets.data)
        ? assets.data
        : [assets.data];
      assetObjects = assetsArray.map((asset: any) => {
        this.stringifyJsonFields(asset);
        // TODO: add more explicit types for `asset`
        return {
          src: asset.attributes.origin_path,
          attributes: asset.attributes,
        };
      });

      return assetObjects;
    } else {
      return [];
    }
  };

  /*
   * Stringifies all JSON field values within the asset.attribute object
   */
  stringifyJsonFields = (asset: AssetProps) => {
    const replaceNullWithEmptyString = (_: any, value: any) =>
      value === null ? '' : value;
    asset.attributes.custom_fields = JSON.stringify(
      asset.attributes.custom_fields,
      replaceNullWithEmptyString,
    );
    asset.attributes.tags = JSON.stringify(
      asset.attributes.tags,
      replaceNullWithEmptyString,
    );
    if (asset.attributes.colors?.dominant_colors) {
      asset.attributes.colors.dominant_colors = JSON.stringify(
        asset.attributes.colors?.dominant_colors,
        replaceNullWithEmptyString,
      );
    }
  };

  /*
   * Constructs an array of imgix image URL from the selected source in the
   * application Dialog component
   */
  buildAssetWithFullUrl(asset: AssetProps[]) {
    const scheme = 'https://';
    const domain = this.state.selectedSource.domain;
    const imgixDomain = '.imgix.net';

    const transformedAsset = asset.map((asset) => ({
      ...asset,
      src: scheme + domain + imgixDomain + asset.src,
    }));
    return transformedAsset;
  }

  /*
   * Requests and constructs fully-qualified image URLs, saving the results to
   * state
   */
  requestImageUrls = async (query?: string, currentIndex?: number) => {
    // if selected source, return assets
    if (Object.keys(this.state.selectedSource).length) {
      const defaultQuery = `?page[number]=${
        currentIndex || this.state.page.currentIndex
      }&page[size]=18`;

      const assetObjects = query
        ? await this.getAssetObjects(query, noSearchAssetsError())
        : this.state.selectedSource.type === 'webfolder'
        ? await this.getAssetObjects(
            defaultQuery,
            noOriginAssetsWebFolderError(),
          )
        : await this.getAssetObjects(defaultQuery, noOriginAssetsError());

      if (assetObjects.length > 0 && this.state.errors.length > 0) {
        this.resetNErrors(this.state.errors.length);
      }

      const assets = this.buildAssetWithFullUrl(assetObjects);
      // if at least one path, remove placeholders

      if (assets.length) {
        this.setState({
          assets,
          isSearching: false,
          loading: false,
        });
      } else {
        this.setState({ assets: [] });
      }
    }
  };

  upload = (buffer: Buffer) => {
    let { file, filename, source, destination } = this.state.uploadForm;

    // do nothing if fileForm is invalid
    if (!file || !source) {
      console.error('imgix: cannot upload a form with missing file or source');
      return;
    }

    let _destination, path;
    if (destination) {
      // strip the leading and trailing slash from destination
      _destination = destination.replace(/^\//, '').replace(/\/$/, '');
      path = _destination + '/' + filename;
    } else {
      path = filename;
    }

    // make a put request to upload the file
    const imgix = this.state.imgix;
    // wait until request fails/succeeds
    // close the modal
    this.setIsUploading(true);
    imgix
      .request(`sources/${source.id}/upload/${path}`, {
        method: 'POST',
        body: buffer,
      })
      .then(
        (_resp) => {
          this.setState({ isUploading: false, showUpload: false });
          Notification.setPosition('top', { offset: 565 });
          Notification.success('File successfully uploaded to imgix Source.', {
            duration: 50000,
            id: 'ix-dialog-notification',
          });
          this.requestImageUrls();
        },
        (error: APIError) => {
          // Note the APIError.message doesn't have as much detail as the
          // response.errors[0].detail does. This is why we're accessing that
          // instead.
          const errorResponse = error.response as {
            errors: [{ detail: string }];
          };
          // In the rare case the response doesn't have an `errors` array, we
          // need to do some optional chaining here to avoid trying to access
          // a property or index that does not exist.
          const reason = errorResponse?.errors[0]?.detail;
          console.error('imgix: upload error', error.response);
          Notification.setPosition('top', { offset: 565 });
          Notification.error(`Upload failed: ${reason}`, {
            duration: 10000,
            id: 'ix-dialog-notification',
          });
          // We're not adding this error to state because `errors` in state is used as a UI fallback, not a notification message.
          this.setState({
            isUploading: false,
            showUpload: false,
            loading: false,
          });
        },
      );
  };

  uploadAssets = async () => {
    let { file } = this.state.uploadForm;
    // create a Buffer from the users' selected asset and upload that buffer
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        // convert image file to base64 string
        const assetBase64String = reader.result as string;
        const fileString = assetBase64String.replace(
          /^data:image\/gif;base64,|^data:image\/png;base64,|^data:image\/jpeg;base64,|^data:image\/jpg;base64,|^data:image\/bmp;base64,|^data:image\/webp;base64,/,
          '',
        );
        const buffer = Buffer.from(fileString, 'base64');
        this.upload(buffer);
      },
      false,
    );
    reader.readAsDataURL(file as File);
  };

  setIsUploading = (value: boolean) => {
    this.setState({ isUploading: value });
  };

  setShowUpload = (value: boolean) => {
    this.setState({ showUpload: value });
  };

  setUploadSource = (source: { id: string; name: string; domain: string }) => {
    const uploadForm = { ...this.state.uploadForm, source };
    this.setState({ uploadForm });
  };

  setDestinationFilePath = (filePath: string) => {
    const uploadForm = { ...this.state.uploadForm, destination: filePath };
    this.setState({ uploadForm });
  };

  updateDestinationFilePath = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setDestinationFilePath(value);
  };

  setFilename = (filename: string) => {
    const uploadForm = { ...this.state.uploadForm, filename: filename };
    this.setState({ uploadForm });
  };

  updateFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setFilename(value);
  };

  openFileForm = (file: File, previewSource: string, showUpload: boolean) => {
    const uploadForm = {
      ...this.state.uploadForm,
      file,
      filename: file.name,
      source: this.state.selectedSource,
      previewSource,
    };
    this.setState({ uploadForm, showUpload });
  };

  async componentDidUpdate(prevProps: DialogProps, prevState: DialogState) {
    if (
      this.state.selectedSource.id !== prevState.selectedSource.id ||
      (this.state.page.currentIndex !== prevState.page.currentIndex &&
        !this.state.isSearching)
    ) {
      this.setState({ loading: true });
      this.requestImageUrls(undefined, 0);
    }
  }

  render() {
    const { selectedSource, allSources, page, assets, uploadForm } = this.state;
    const sdk = this.props.sdk;
    const selectedImage = (
      this.props.sdk.parameters.invocation as AppInvocationParameters
    )?.selectedImage;

    return (
      <div className="ix-container">
        <div className="ix-header-container">
          <Paragraph className="ix-title">imgix Source:</Paragraph>
        </div>{' '}
        <div className="ix-sources">
          <SourceSelect
            selectedSource={selectedSource}
            allSources={allSources}
            setSource={this.setSelectedSource}
            resetErrors={() => this.resetNErrors(this.state.errors.length)}
          />
          {this.state.selectedSource.id && (
            <div className="ix-top-bar-container">
              <Form className="ix-searchForm">
                <TextInput
                  type="search"
                  className="ix-searchBar"
                  placeholder="Search by name or folder path"
                  value={this.state.searchTerm}
                  onChange={(
                    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                  ) => this.setState({ searchTerm: e.target.value })}
                />
                <Button
                  buttonType="muted"
                  className="ix-searchButton"
                  icon="Search"
                  type="submit"
                  onClick={this.debounceSearchOnClick}
                >
                  Search
                </Button>
              </Form>
              <UploadButton
                disabled={selectedSource && selectedSource.type === 'webfolder'}
                handleFileChange={this.openFileForm}
              />
            </div>
          )}
        </div>
        <ImageGallery
          selectedSource={selectedSource}
          sdk={sdk}
          pageInfo={page}
          changePage={this.debounceHandlePageChange}
          assets={assets}
          loading={this.state.loading}
        />
        {/* { UI Error fallback } */}
        {this.state.errors.length > 0 && (
          <Note
            error={this.state.errors[0]}
            type={this.state.errors[0].type}
            resetErrorBoundary={this.resetNErrors}
            dismissable={this.state.errors[0].dismissable}
          />
        )}
        {this.state.showUpload && (
          <div className="ix-upload-editor-container">
            <div className="ix-upload-editor">
              <div className="ix-upload-title-bar">
                <p className="ix-upload-header-text">
                  <Subheading>Upload to Asset Manager</Subheading>
                </p>
                <Button
                  size="small"
                  buttonType="naked"
                  icon="Close"
                  className="ix-close-button"
                  disabled={this.state.isUploading}
                  onClick={() => this.setShowUpload(false)}
                ></Button>
              </div>
              <div className="ix-upload-content">
                <div className="ix-upload-options">
                  <div className="ix-upload-sources">
                    <SectionHeading>imgix source:</SectionHeading>
                    <SourceSelect
                      testId="upload-source-select-dropdown"
                      selectedSource={uploadForm.source || selectedSource}
                      allSources={allSources.filter(
                        (source) => source.type !== 'webfolder',
                      )}
                      setSource={this.setUploadSource}
                      resetErrors={() =>
                        this.resetNErrors(this.state.errors.length)
                      }
                      disabled={this.state.isUploading}
                    />
                  </div>
                  <form onSubmit={this.uploadAssets}>
                    <div className="ix-upload-destination">
                      <SectionHeading>destination path</SectionHeading>
                      <TextInput
                        className={
                          this.state.isUploading ? 'ix-input-readonly' : ''
                        }
                        value={this.state.uploadForm.destination || '/'}
                        onChange={this.updateDestinationFilePath}
                        placeholder="/"
                        isReadOnly={this.state.isUploading}
                      ></TextInput>
                    </div>
                  </form>

                  <div id="ix-destination-tooltip">
                    <Tooltip
                      place="top"
                      content="Assets can be uploaded to any directory path in your asset storage. If you leave this blank, assets will be uploaded to the root directory."
                    >
                      <Icon
                        className="ix-destination-tooltip-icon"
                        icon="InfoCircle"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="ix-upload-preview">
                  <img
                    alt="upload-preview"
                    src={uploadForm.previewSource}
                    width={384}
                    height={288}
                  />
                  <div className="ix-upload-preview-filename">
                    <TextInput
                      className={
                        this.state.isUploading ? 'ix-input-readonly' : ''
                      }
                      value={this.state.uploadForm.filename || ''}
                      onChange={this.updateFileName}
                      isReadOnly={this.state.isUploading}
                    ></TextInput>
                  </div>
                </div>
                <Button
                  size="small"
                  buttonType="positive"
                  className="ix-upload-confirm-button"
                  onClick={this.uploadAssets}
                  loading={this.state.isUploading}
                  disabled={this.state.isUploading}
                >
                  {this.state.isUploading ? 'Uploading' : 'Confirm Upload'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
