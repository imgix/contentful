import { Component } from 'react';

import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

import { FieldImagePreview, FieldPrompt } from './';
import './Field.css';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FieldState {
  imagePath: string;
}

export default class Field extends Component<FieldProps, FieldState> {
  constructor(props: FieldProps) {
    super(props);

    const storedValue = this.props.sdk.field.getValue();

    this.state = {
      imagePath: storedValue || '',
    };
  }

  openDialog = () => {
    this.props.sdk.dialogs
      .openCurrentApp({
        width: 1200,
        minHeight: 1200,
        position: 'top',
        shouldCloseOnOverlayClick: true,
      })
      .then((imagePath) =>
        this.setState({ imagePath }, () =>
          this.props.sdk.field.setValue(imagePath),
        ),
      );
  };

  render() {
    if (this.state.imagePath) {
      return <FieldImagePreview imagePath={this.state.imagePath} />;
    } else {
      return <FieldPrompt onClick={this.openDialog} />;
    }
  }
}
