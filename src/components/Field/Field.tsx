import { Component } from 'react';

import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

import { FieldImagePreview, FieldPrompt } from './';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FieldState {
  imagePath: string | undefined;
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
        width: 'fullWidth',
        minHeight: 1200,
        position: 'top',
        shouldCloseOnOverlayClick: true,
        allowHeightOverflow: true,
      })
      .then((imagePath) =>
        this.setState({ imagePath }, () =>
          this.props.sdk.field.setValue(imagePath),
        ),
      );
  };

  clearSelection = () => {
    this.setState({ imagePath: undefined }, () =>
      this.props.sdk.field.setValue(undefined),
    );
  };

  render() {
    const updateHeightHandler = this.props.sdk.window.updateHeight;
    if (this.state.imagePath) {
      return (
        <FieldImagePreview
          imagePath={this.state.imagePath}
          openDialog={this.openDialog}
          updateHeight={updateHeightHandler}
          clearSelection={this.clearSelection}
        />
      );
    } else {
      return (
        <FieldPrompt
          openDialog={this.openDialog}
          updateHeight={updateHeightHandler}
        />
      );
    }
  }
}
