import React from 'react';
import { Button, Paragraph } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  return (
    <div>
      <Paragraph>Hello Entry Field Component</Paragraph>
      <Button
        onClick={() => {
          props.sdk.dialogs
            .openCurrentApp({ width: 1000, minHeight: 2000 })
        }}
      />
    </div>
  );
};

export default Field;
