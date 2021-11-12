import { Component, ChangeEvent } from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import ImgixAPI, { APIError } from 'imgix-management-js';
import { debounce } from 'lodash';

import { DialogHeader } from './';
import { AppInstallationParameters } from '../ConfigScreen/';
import { ImageGallery } from '../Gallery/';
import { SourceSelect } from '../SourceSelect/';
import { Note } from '../Note/';
import {
  IxError,
  invalidApiKeyError,
  noSourcesError,
  noOriginImagesError,
} from '../../helpers/errors';

import './Dialog.css';
import { TextInput, Button, Form } from '@contentful/forma-36-react-components';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface DialogState {
  imgix: ImgixAPI;
  isOpen: boolean;
  allSources: Array<SourceProps>;
  selectedSource: Partial<SourceProps>;
  page: PageProps;
  verified: boolean; // if API key is verified
  searchTerm?: string;
  assets: Array<string>;
  errors: IxError[]; // array of IxErrors if any
  isSearching: boolean;
}

export type PageProps = {
  currentIndex: number;
  totalPageCount: number;
};

export type SourceProps = {
  id: string;
  name: string;
  domain: string;
};

type AppInvocationParameters = {
  selectedImage: string;
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
    };
  }

  getSources = async () => {
    return await this.state.imgix.request('sources');
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
        if (source.attributes.enabled) {
          const id = source.id;
          const name = source.attributes.name;
          // there may be multiple domains, but we'll extract the first one for now
          let domain = source.attributes.deployment.imgix_subdomains[0];
          result.push({ id, name, domain });
        }
        return result;
      },
      [] as SourceProps[],
    );

    return enabledSources;
  };

  handleTotalImageCount = (totalImageCount: number) => {
    const totalPageCount = Math.ceil(totalImageCount / 18);
    let errors = [...this.state.errors];

    if (!totalPageCount) {
      errors.push(noOriginImagesError());
    }

    return this.setState({
      page: {
        ...this.state.page,
        totalPageCount,
      },
      errors,
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
    this.setState({ selectedSource: source });
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
      this.setState({ allSources: sources });
    } catch (error) {
      this.setState({ errors: [error] as IxError[] });
    }
  }

  getImages = async (query: string) => {
    const assets = await this.state.imgix.request(
      `assets/${this.state.selectedSource?.id}${query}`,
    );
    // TODO: add more explicit types for image
    this.handleTotalImageCount(
      parseInt((assets.meta.cursor as any).totalRecords || 0),
    );
    return assets;
  };

  getImagePaths = async (query: string) => {
    let images,
      allOriginPaths: string[] = [];

    try {
      images = await this.getImages(query);
    } catch (error) {
      // APIError will emit more helpful data for debugging
      if (error instanceof APIError) {
        console.error(error.toString());
      } else {
        console.error(error);
      }
      return allOriginPaths;
    }

    /*
     * Resolved requests can either return an array of objects or a single
     * object via the `data` top-level field. When parsing all enabled sources,
     * both possibilities must be accounted for.
     */
    if (images) {
      const imagesArray = Array.isArray(images.data)
        ? images.data
        : [images.data];
      imagesArray.map((image: any) =>
        // TODO: add more explicit types for image
        allOriginPaths.push(image.attributes.origin_path),
      );

      return allOriginPaths;
    } else {
      return [];
    }
  };

  /*
   * Constructs an array of imgix image URL from the selected source in the
   * application Dialog component
   */
  constructUrl(images: string[]) {
    const scheme = 'https://';
    const domain = this.state.selectedSource.name;
    const imgixDomain = '.imgix.net';

    const urls = images.map(
      (path: string) => scheme + domain + imgixDomain + path,
    );
    return urls;
  }

  /*
   * Requests and constructs fully-qualified image URLs, saving the results to
   * state
   */
  requestImageUrls = async (query?: string) => {
    // if selected source, return images
    if (Object.keys(this.state.selectedSource).length) {
      const defaultQuery = `?page[number]=${this.state.page.currentIndex}&page[size]=18`;
      const images = await this.getImagePaths(query || defaultQuery);
      const assets = this.constructUrl(images);
      // if at least one path, remove placeholders

      if (assets.length) {
        this.setState({
          assets,
          isSearching: false,
        });
      } else {
        this.setState({ assets: [] });
      }
    }
  };

  async componentDidUpdate(prevProps: DialogProps, prevState: DialogState) {
    if (
      this.state.selectedSource.id !== prevState.selectedSource.id ||
      (this.state.page.currentIndex !== prevState.page.currentIndex &&
        !this.state.isSearching)
    ) {
      this.requestImageUrls();
    }
  }

  render() {
    const { selectedSource, allSources, page, assets } = this.state;
    const sdk = this.props.sdk;
    const selectedImage = (
      this.props.sdk.parameters.invocation as AppInvocationParameters
    )?.selectedImage;

    return (
      <div className="ix-container">
        <DialogHeader handleClose={sdk.close} selectedImage={selectedImage} />
        <div className="ix-sources">
          <SourceSelect
            selectedSource={selectedSource}
            allSources={allSources}
            setSource={this.setSelectedSource}
            resetErrors={() => this.resetNErrors(this.state.errors.length)}
          />
          {this.state.selectedSource.id && (
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
          )}
        </div>
        <ImageGallery
          selectedSource={selectedSource}
          sdk={sdk}
          pageInfo={page}
          changePage={this.debounceHandlePageChange}
          assets={assets}
        />
        {/* { UI Error fallback } */}
        {this.state.errors.length > 0 && (
          <Note
            error={this.state.errors[0]}
            type={this.state.errors[0].type}
            resetErrorBoundary={this.resetNErrors}
          />
        )}
      </div>
    );
  }
}
