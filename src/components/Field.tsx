import { Component } from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FieldState {
  image: string;
}

export default class Field extends Component<FieldProps, FieldState> {

  return (
    <div>
      <Paragraph>Hello Entry Field Component</Paragraph>
      <Button
        onClick={() => {
          props.sdk.dialogs.openCurrentApp({
            width: 'fullWidth',
            minHeight: 1000,
            position: 'top',
          });
        }}
      >
        Select an Image
      </Button>
    </div>
  );
};

export default Field;
