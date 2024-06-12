import { Icon, Tooltip } from '@contentful/forma-36-react-components';
import React, { ReactNode, useEffect } from 'react';
import { AssetProps } from '../Dialog';

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

export const CheckboxList = ({
  render,
  selectedAsset,
  onCheckChange,
}: {
  render: ({
    field,
  }: {
    field: {
      id: string;
      labelText: string;
    };
  }) => ReactNode;
  selectedAsset: AssetProps;
  onCheckChange: any;
}) => {
  const existingParams = selectedAsset.imgixParams || {};

  const [checkboxValues, setCheckboxValues] = React.useState({
    'auto=format': existingParams['auto']?.includes('format') || false,
    'auto=enhance': existingParams['auto']?.includes('enhance') || false,
    'auto=compress': existingParams['auto']?.includes('compress') || false,
    'auto=redeye': existingParams['auto']?.includes('redeye') || false,
    'bg-remove': !!existingParams['bg-remove'],
    upscale: !!existingParams['upscale'],
  });

  /**
   * Determines if a checkbox should be disabled.
   */
  const isCheckboxDisabled = (key: string): boolean => {
    if (key === 'bg-remove') return checkboxValues['upscale'];
    if (key === 'upscale') return checkboxValues['bg-remove'];
    return false;
  };

  /**
   * Determines if the parameter requires a source capability.
   */
  const isCapabilityGatedParameter = (parameter: string) =>
    Object.keys(PERMISSIONS_GATED_PARAMETERS).filter((param) =>
      parameter.includes(param),
    ).length > 0;

  const handleChange =
    (
      key: keyof typeof INITIAL_CHECKBOX_STATE,
      value: Record<string, string | boolean | undefined>,
      checked: boolean,
    ) =>
    (_e: React.ChangeEvent<HTMLInputElement>) => {
      setCheckboxValues((prev) => {
        const newState = { ...prev };
        newState[key] = !checked; // toggle the checkbox
        return newState;
      });

      const action = checked ? 'remove' : 'add';
      onCheckChange(value, action);
    };

  useEffect(() => {
    const imgixParams = selectedAsset.imgixParams || {};
    setCheckboxValues({
      'auto=format': imgixParams['auto']?.includes('format') || false,
      'auto=enhance': imgixParams['auto']?.includes('enhance') || false,
      'auto=compress': imgixParams['auto']?.includes('compress') || false,
      'auto=redeye': imgixParams['auto']?.includes('redeye') || false,
      'bg-remove': !!imgixParams['bg-remove'],
      upscale: !!imgixParams['upscale'],
    });
  }, [selectedAsset]); // update checkboxes when the src URL changes

  return (
    <div>
      {Object.entries(PARAM_OPTIONS).map(([key, value]) => {
        // note: silly type-guards for indexing into checkbox state
        const paramKey = key as keyof typeof PARAM_OPTIONS;
        const checkboxKey =
          paramKey satisfies keyof typeof INITIAL_CHECKBOX_STATE;

        // field props for the render slot
        const field = {
          id: key,
          labelText: key,
          disabled: isCheckboxDisabled(checkboxKey),
          checked: checkboxValues[checkboxKey],
          onChange: handleChange(
            checkboxKey,
            value,
            checkboxValues[checkboxKey],
          ),
        };

        return (
          <div className="ix-asset-param" key={`${key}-${value}`}>
            {render({ field })}
            {isCapabilityGatedParameter(key) && (
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
        );
      })}
    </div>
  );
};
