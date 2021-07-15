import { Component } from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import Imgix from 'react-imgix';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface FieldState {
  image: string;
}

export default class Field extends Component<FieldProps, FieldState> {
  constructor(props: FieldProps) {
    super(props);

    const storedValue = this.props.sdk.field.getValue();

    this.state = {
      image: storedValue || '',
    };
  }

  render() {
    return (
      <div>
        {this.state.image && (
          <div>
            <Imgix
              width={100}
              height={100}
              src={this.state.image}
              imgixParams={{
                auto: 'format',
                fit: 'crop',
                crop: 'entropy',
              }}
            />
          </div>
        )}
        <Button
          onClick={() => {
            this.props.sdk.dialogs
              .openCurrentApp({
                width: 1200,
                minHeight: 1200,
                position: 'top',
                shouldCloseOnOverlayClick: true,
              })
              .then((image) =>
                this.setState({ image }, () =>
                  this.props.sdk.field.setValue(image),
                ),
              );
          }}
        >
          Select an Image
        </Button>
      </div>
    );
  }
}