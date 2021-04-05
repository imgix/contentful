import React, { Component } from 'react';
import {
  Button,
  Paragraph,
  Dropdown,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
// @ts-ignore - TODO add .d.ts file
import ImgixApi from 'imgix-management-js';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface DialogState {
  imgix: any; // TODO - replace with class type
  isOpen: boolean;
  allSources: Array<SourceProps>;
  selectedSource: Partial<SourceProps>;
}

type SourceProps = {
  id: string;
  name: string;
};

export default class Dialog extends Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);

    const apiKey =
      (props as any).sdk?.parameters.installation.imgixAPIKey || '';
    const imgix = new ImgixApi({
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
    const sources = await this.getSources(props);
    const enabledSources = sources.data.reduce(
      (result: SourceProps[], source: any) => {
        if (source.attributes.enabled) {
          let id = source.id;
          let name = source.attributes.name;
          result.push({ id, name });
        }
        return result;
      },
      [],
    );

    return enabledSources;
  };

  getImages = async () => {
    return this.state.imgix.request(`assets/${this.state.selectedSource?.id}`);
  };

  getImagePaths = async () => {
    const images = await this.getImages();
    return images.data.map((image: any) => image.attributes.origin_path);
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
                  this.setState({ selectedSource: source });
                  this.setOpen(!this.state.isOpen);
                }}
              >
                {source.name}
              </DropdownListItem>
            ))}
          </DropdownList>
        </Dropdown>
        <br />
        <Button onClick={() => this.props.sdk.close('Done!')} />
      </div>
    );
  }
}
