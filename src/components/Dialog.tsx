import { Component } from 'react';
import {
  Button,
  Paragraph,
  Dropdown,
  DropdownList,
  DropdownListItem,
  Icon,
} from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { AppInstallationParameters } from './ConfigScreen';
import ImgixAPI, { APIError } from 'imgix-management-js';
import Gallery from './Gallery/ImageGallery';
import './Dialog.css';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface DialogState {
  imgix: ImgixAPI;
  isOpen: boolean;
  allSources: Array<SourceProps>;
  selectedSource: Partial<SourceProps>;
}

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

  setOpen = (isOpen: boolean, selectedSource?: SourceProps) => {
    if (selectedSource) {
      this.setState({ isOpen, selectedSource });
    } else {
      this.setState({ isOpen });
    }
  };

  async componentDidMount() {
    const sources = await this.getSourceIDAndPaths();
    this.setState({ allSources: sources });
  }

  render() {
    return (
      <div className="ix-container">
        <div className="ix-header-container">
          <Paragraph className="ix-title">imgix Source:</Paragraph>
          <Button
            className="ix-close-button"
            icon="Close"
            buttonType="naked"
            size="small"
            onClick={() => this.props.sdk.close()}
          ></Button>
        </div>
        <Dropdown
          className="ix-dropdown"
          isOpen={this.state.isOpen}
          onClose={() => this.setOpen(false)}
          toggleElement={
            <Button
              size="small"
              buttonType="muted"
              indicateDropdown
              onClick={() => this.setOpen(!this.state.isOpen)}
            >
              {this.state.selectedSource.name || 'Select an imgix Source'}
            </Button>
          }
        >
          <DropdownList>
            {this.state.allSources.map((source: SourceProps) => (
              <DropdownListItem
                key={source.id}
                onClick={() => this.setOpen(false, source)}
              >
                {source.name}
              </DropdownListItem>
            ))}
          </DropdownList>
        </Dropdown>
        <Gallery
          selectedSource={this.state.selectedSource}
          imgix={this.state.imgix}
          sdk={this.props.sdk}
        />
        {this.state.selectedSource.id && (
            <Button buttonType="muted" icon="ChevronLeft" size="small">
              Prev Page
            </Button>
            <Dropdown
              toggleElement={
                <Button size="small" buttonType="muted" indicateDropdown>
                  {'Page 1 of 5'} {/* TODO: replace placeholder */}
                </Button>
              }
            >
              {/* placeholder */}
            </Dropdown>
            <Button buttonType="muted" size="small">
                Next Page
                <Icon
                  color="secondary"
                  icon="ChevronRight"
                />
            </Button>
        )}
      </div>
    );
  }
}
