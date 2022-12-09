import { Component } from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { debounce } from 'lodash';

import { FieldImagePreview, FieldPrompt } from './';
import { AssetProps } from '../Dialog';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FieldState {
  selectedAsset: AssetProps | undefined;
}

export default class Field extends Component<FieldProps, FieldState> {
  constructor(props: FieldProps) {
    super(props);

    const storedValue = this.props.sdk.field.getValue();

    this.state = {
      selectedAsset: storedValue || undefined,
    };
  }

  openDialog = () => {
    this.props.sdk.dialogs
      .openCurrentApp({
        width: 1200,
        minHeight: 660,
        position: 'top',
        shouldCloseOnOverlayClick: true,
        allowHeightOverflow: false,
        parameters: {
          selectedImage: this.state.selectedAsset,
        },
      })
      .then((selectedAsset) => {
        if (selectedAsset) {
          return this.setState({ selectedAsset }, () =>
            this.props.sdk.field.setValue(selectedAsset),
          );
        }
      });
  };
  debounceOpenDialog = debounce(this.openDialog, 1000, { leading: true });

  clearSelection = () => {
    this.setState({ selectedAsset: undefined }, () =>
      this.props.sdk.field.setValue(undefined),
    );
  };

  render() {
    const updateHeightHandler = this.props.sdk.window.updateHeight;
    if (this.state.selectedAsset && this.state.selectedAsset.src) {
      return (
        <FieldImagePreview
          contentType={this.state.selectedAsset.attributes.content_type}
          imagePath={this.state.selectedAsset?.src}
          openDialog={this.debounceOpenDialog}
          updateHeight={updateHeightHandler}
          clearSelection={this.clearSelection}
        />
      );
    } else {
      return (
        <FieldPrompt
          openDialog={this.debounceOpenDialog}
          updateHeight={updateHeightHandler}
        />
      );
    }
  }
}
