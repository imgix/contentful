import { Component } from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  CheckboxField,
  Icon,
  SectionHeading,
  Tooltip,
} from '@contentful/forma-36-react-components';
import { debounce } from 'lodash';

import { FieldImagePreview, FieldPrompt } from './';
import { AssetProps } from '../Dialog';
import { groupParamsByKey, paramsReducer } from '../../helpers/utils';

import './Field.css';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FieldState {
  selectedAsset: AssetProps | undefined;
  checkboxValues: Record<string, boolean>;
}

/**
 * note: the management API doesn't return permissions object, as a result
 * we're manually keeping track of the params that needs tooltip. In future, we
 * should remove this when there's a reliable way to check for permissions.
 */
const PERMISSIONS_GATED_PARAMETERS = {
  'bg-remove': { 'bg-remove': true },
  upscale: { upscale: true },
};

const PARAM_OPTIONS = {
  'auto=format': { auto: 'format' },
  'auto=enhance': { auto: 'enhance' },
  'auto=compress': { auto: 'compress' },
  'auto=redeye': { auto: 'redeye' },
  ...PERMISSIONS_GATED_PARAMETERS,
};

const INITIAL_CHECKBOX_STATE = {
  'auto=format': false,
  'auto=enhance': false,
  'auto=compress': false,
  'auto=redeye': false,
  'bg-remove': false,
  upscale: false,
};

export default class Field extends Component<FieldProps, FieldState> {
  constructor(props: FieldProps) {
    super(props);

    const storedValue = this.props.sdk.field.getValue();
    const imgixParams = storedValue?.imgixParams || {};

    this.state = {
      selectedAsset: storedValue || undefined,
      // todo: find a better way to manage this state using imgix-url-params spec
      checkboxValues: {
        'auto=format': imgixParams['auto']?.includes('format') || false,
        'auto=enhance': imgixParams['auto']?.includes('enhance') || false,
        'auto=compress': imgixParams['auto']?.includes('compress') || false,
        'auto=redeye': imgixParams['auto']?.includes('redeye') || false,
        'bg-remove': !!imgixParams['bg-remove'],
        upscale: !!imgixParams['upscale'],
      },
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
          return this.setState(
            { selectedAsset, checkboxValues: { ...INITIAL_CHECKBOX_STATE } },
            () => this.props.sdk.field.setValue(selectedAsset),
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
    // Update the params
    const newParams = paramsReducer(url.searchParams, params, action);
    // Construct the new URL string
    const newURL = `${url.origin}${url.pathname}?${newParams.toString()}`;

    // Use setState callback to ensure we use the latest state
    this.setState(
      (prevState) => {
        const updatedSelectedAsset = {
          ...prevState.selectedAsset,
          src: newURL,
          imgixParams: groupParamsByKey(new URL(newURL).searchParams),
        };

        // todo: don't cast here
        return {
          ...prevState,
          selectedAsset: updatedSelectedAsset,
        } as FieldState;
      },
      () => {
        // Update field value after state update
        this.props.sdk.field.setValue(this.state.selectedAsset);
      },
    );
  };

  /**
   * Toggle checkbox and add/remove the selected parameter
   */
  handleCheckboxChange =
    (
      key: string,
      value: Record<string, string | boolean | undefined>,
      checked: boolean,
    ) =>
    (_e: React.ChangeEvent<HTMLInputElement>) => {
      const action = checked ? 'remove' : 'add';

      this.updateParams(value, action);
      this.setState((prevState) => ({
        checkboxValues: {
          ...prevState.checkboxValues,
          [key]: !checked,
        },
      }));
    };

  /**
   * Determines if a checkbox should be disabled
   */
  isCheckboxDisabled = (key: string): boolean => {
    const { checkboxValues } = this.state;
    if (key === 'bg-remove') return checkboxValues['upscale'];
    if (key === 'upscale') return checkboxValues['bg-remove'];
    return false;
  };

  isCapabilityGatedParameter = (parameter: string) =>
    Object.keys(PERMISSIONS_GATED_PARAMETERS).filter((param) =>
      parameter.includes(param),
    ).length > 0;

  render() {
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
                {Object.entries(PARAM_OPTIONS).map(([key, value]) => (
                  <div className="ix-asset-param" key={`${key}-${value}`}>
                    <CheckboxField
                      id={key}
                      labelText={key}
                      checked={this.state.checkboxValues[key]}
                      disabled={this.isCheckboxDisabled(key)}
                      onChange={this.handleCheckboxChange(
                        key,
                        value,
                        this.state.checkboxValues[key],
                      )}
                    />
                    {this.isCapabilityGatedParameter(key) && (
                      <Tooltip
                        id={key}
                        hideDelay={50}
                        content={
                          <span>
                            <a
                              className="ix-field-checkbox-tooltip-link"
                              target="_blank"
                              rel="noreferrer"
                              href="https://www.imgix.com/contact-us?imgix-plugin=contentful"
                            >
                              Contact us
                            </a>{' '}
                            to enable this parameter
                          </span>
                        }
                      >
                        <Icon
                          className="ix-field-checkbox-tooltip-icon"
                          icon="InfoCircle"
                        />
                      </Tooltip>
                    )}
                  </div>
                ))}
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
