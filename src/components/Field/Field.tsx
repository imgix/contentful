import { Component } from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  CheckboxField,
  SectionHeading,
} from '@contentful/forma-36-react-components';
import { debounce } from 'lodash';

import { FieldImagePreview, FieldPrompt } from './';
import { AssetProps } from '../Dialog';
import { groupParamsByKey, paramsReducer } from '../../helpers/utils';

import './Field.css';
import { CheckboxList } from '../CheckboxList/ParamsCheckboxList';

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
        allowHeightOverflow: true,
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

  /**
   * Updates the `src` and `imgixParams` of the currently selected asset.
   */
  updateParams = (
    params: Record<string, string | boolean | undefined>,
    action: 'add' | 'remove' = 'add',
  ) => {
    if (!this.state.selectedAsset) {
      return;
    }

    const url = new URL(this.state.selectedAsset.src || '');
    const newParams = paramsReducer(url.searchParams, params, action);
    const newURL = `${url.origin}${url.pathname}?${newParams.toString()}`;

    // Use setState callback to ensure we use the latest state
    this.setState(
      (prevState) => {
        const updatedSelectedAsset = {
          ...prevState.selectedAsset,
          src: newURL,
          imgixParams: groupParamsByKey(new URL(newURL).searchParams),
        };

        return {
          ...prevState,
          selectedAsset: updatedSelectedAsset,
        } as FieldState; // todo: don't cast here
      },
      () => {
        // Update field value after state update
        this.props.sdk.field.setValue(this.state.selectedAsset);
      },
    );
  };

  render() {
    // Uncomment to test
    // console.log({ ...this.state.selectedAsset });

    const updateHeightHandler = this.props.sdk.window.updateHeight;
    if (this.state.selectedAsset && this.state.selectedAsset.src) {
      return (
        <div className="ix-field-container">
          <div>
            <FieldImagePreview
              contentType={this.state.selectedAsset.attributes.content_type}
              imagePath={this.state.selectedAsset?.src}
              imgixParams={this.state.selectedAsset?.imgixParams}
              openDialog={this.debounceOpenDialog}
              updateHeight={updateHeightHandler}
              clearSelection={this.clearSelection}
            />
            <br></br>
          </div>
          {this.state.selectedAsset.attributes.content_type.startsWith(
            'image',
          ) && (
            <div className="ix-field-form-container">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="ix-asset-params"
              >
                <SectionHeading style={{ paddingBottom: 4 }}>
                  imgix Parameters
                </SectionHeading>
                <CheckboxList
                  selectedAsset={this.state.selectedAsset}
                  onCheckChange={(
                    value: Record<string, string | boolean | undefined>,
                    action: 'add' | 'remove',
                  ) => this.updateParams(value, action)}
                  render={({ field }) => <CheckboxField {...field} />}
                />
              </form>
            </div>
          )}
        </div>
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
