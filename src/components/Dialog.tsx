import React, { Component } from 'react';
import { Button, Paragraph } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
// @ts-ignore - TODO add .d.ts file
import ImgixApi from 'imgix-management-js';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface DialogState {
  imgix: any; // TODO - replace with class type
}

export default class Dialog extends Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);

    const apiKey = (props as any).sdk.parameters.installation.imgixAPIKey;
    const imgix = new ImgixApi({
      apiKey,
    });

    this.state = {
      imgix,
    };
  }

  render() {
    return (
      <div>
        <Paragraph>Hello Dialog Component</Paragraph>
        <Button onClick={() => this.props.sdk.close('Done!')} />
      </div>
    );
  }
}
