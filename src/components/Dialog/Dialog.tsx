import { Component } from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import ImgixAPI, { APIError } from 'imgix-management-js';

import { DialogHeader } from './';
import { AppInstallationParameters } from '../ConfigScreen/';
import { ImageGallery } from '../Gallery/';
import { SourceSelect } from '../SourceSelect/';

import './Dialog.css';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface DialogState {
  imgix: ImgixAPI;
  isOpen: boolean;
  allSources: Array<SourceProps>;
  selectedSource: Partial<SourceProps>;
  page: PageProps;
}

export type PageProps = {
  current: number;
  totalPageCount: number;
};

export type SourceProps = {
  id: string;
  name: string;
  domain: string;
};

export default class Dialog extends Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);

    const apiKey =
      (props.sdk.parameters.installation as AppInstallationParameters)
        .imgixAPIKey || '';
    const imgix = new ImgixAPI({
      apiKey,
    });

    this.state = {
      imgix,
      isOpen: false,
      allSources: [],
      selectedSource: {},
      page: {
        current: 1,
        totalPageCount: 1,
      },
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

  handleTotalImageCount = (totalImageCount: number) =>
    this.setState({
      page: { current: 1, totalPageCount: Math.ceil(totalImageCount / 18) },
    });

  handlePageChange = (newPageIndex: number) =>
    this.setState({ page: { ...this.state.page, current: newPageIndex } });

  setSelectedSource = (source: SourceProps) => {
    this.setState({ selectedSource: source });
  };

  async componentDidMount() {
    const sources = await this.getSourceIDAndPaths();
    this.setState({ allSources: sources });
  }

  render() {
    const { selectedSource, allSources, page, imgix } = this.state;
    const sdk = this.props.sdk;

    return (
      <div className="ix-container">
        <DialogHeader handleClose={this.props.sdk.close} />
        <SourceSelect
          selectedSource={selectedSource}
          allSources={allSources}
          setSource={this.setSelectedSource}
        />
        <ImageGallery
          selectedSource={selectedSource}
          imgix={imgix}
          sdk={sdk}
          getTotalImageCount={this.handleTotalImageCount}
          pageInfo={page}
          changePage={this.handlePageChange}
        />
      </div>
    );
  }
}
