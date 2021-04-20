import React, { Component } from 'react';
import {
  Button,
  Paragraph,
  Dropdown,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { AppInstallationParameters } from './ConfigScreen';
import ImgixAPI from 'imgix-management-js';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface DialogState {
  imgix: ImgixAPI;
  isOpen: boolean;
  allSources: Array<SourceProps>;
  selectedSource: Partial<SourceProps>;
}

type SourceProps = {
  id: string;
  name: string;
  domain: string;
};

export default class Dialog extends Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);

    const apiKey =
      (props.sdk.parameters.installation as AppInstallationParameters).imgixAPIKey || '';
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

  getSources = async (props: DialogProps) => {
    return await this.state.imgix.request('sources');
  };

  getSourceIDAndPaths = async (
    props: DialogProps,
  ): Promise<Array<SourceProps>> => {
    let sources,
      enabledSources: Array<SourceProps> = [];

    try {
      sources = await this.getSources(props);
    } catch (error) {
      console.error(error.toString());
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

  getImages = async () => {
    return await this.state.imgix.request(`assets/${this.state.selectedSource?.id}`);
  };

  getImagePaths = async () => {
    let images,
      allOriginPaths: string[] = [];

    try {
      images = await this.getImages();
    } catch (error) {
      console.error(error.toString());
      return allOriginPaths;
    }

    /*
     * Resolved requests can either return an array of objects or a single
     * object via the `data` top-level field. When parsing all enabled sources,
     * both possibilities must be accounted for.
     */
    const imagesArray = Array.isArray(images.data)
      ? images.data
      : [images.data];
    imagesArray.map((image: any) =>
      // TODO: add more explicit types for image
      allOriginPaths.push(image.attributes.origin_path),
    );

    return allOriginPaths;
  };

  setOpen = (isOpen: boolean) => {
    this.setState({ isOpen: isOpen });
  };

  async componentDidMount() {
    const sources = await this.getSourceIDAndPaths(this.props);
    this.setState({ allSources: sources });
  }

  render() {
    return (
      <div>
        <Paragraph>Hello Dialog Component</Paragraph>
        <Dropdown
          isOpen={this.state.isOpen}
          onClose={() => this.setOpen(false)}
          toggleElement={
            <Button
              size="small"
              buttonType="muted"
              indicateDropdown
              onClick={() => this.setOpen(!this.state.isOpen)}
            >
              {this.state.selectedSource.name || 'Select a Source'}
            </Button>
          }
        >
          <DropdownList>
            {this.state.allSources.map((source: SourceProps) => (
              <DropdownListItem
                key={source.id}
                onClick={() => {
                  this.setState({ selectedSource: source }, async () => {
                    this.setOpen(false);
                    await this.getImagePaths();
                  });
                }}
              >
                {source.name}
              </DropdownListItem>
            ))}
          </DropdownList>
        </Dropdown>
        <br />
        <Button onClick={() => this.props.sdk.close('Done!')}>Done</Button>
      </div>
    );
  }
}
