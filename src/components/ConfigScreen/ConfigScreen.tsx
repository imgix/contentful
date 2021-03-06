import { Component, ChangeEvent } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Form,
  Workbench,
  Paragraph,
  TextField,
  Notification,
  Icon,
  Button,
} from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import ImgixAPI from 'imgix-management-js';

import './ConfigScreen.css';

export interface AppInstallationParameters {
  imgixAPIKey?: string;
  successfullyVerified?: boolean;
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  isButtonLoading?: boolean;
  validationMessage?: string;
  parameters: AppInstallationParameters;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      isButtonLoading: false,
      validationMessage: '',
      parameters: {},
    };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null =
      await this.props.sdk.app.getParameters();

    this.setState(parameters ? { parameters } : this.state, () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await this.props.sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters: this.state.parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  };

  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      parameters: {
        imgixAPIKey: e.target.value,
        successfullyVerified: this.state.parameters.successfullyVerified,
      },
    });
  };

  verifyAPIKey = async () => {
    this.setState({ isButtonLoading: true });

    const imgix = new ImgixAPI({
      apiKey: this.state.parameters.imgixAPIKey || '',
    });

    let updatedInstallationParameters: AppInstallationParameters = {
      ...this.state.parameters,
    };

    try {
      await imgix.request('sources');
      Notification.success('Your API Key was successfully confirmed.', {
        duration: 3000,
      });
      updatedInstallationParameters.successfullyVerified = true;
    } catch (error) {
      Notification.error(
        "We couldn't verify this API Key. Confirm your details and try again.",
        {
          duration: 3000,
        },
      );
      updatedInstallationParameters.successfullyVerified = false;
    } finally {
      this.setState({
        validationMessage: '',
        isButtonLoading: false,
        parameters: updatedInstallationParameters,
      });
    }
  };

  onClick = async () => {
    if (this.state.parameters.imgixAPIKey === '') {
      let updatedInstallationParameters: AppInstallationParameters = {
        ...this.state.parameters,
      };
      updatedInstallationParameters.successfullyVerified = false;
      this.setState({
        validationMessage: 'Please input your API Key',
        parameters: updatedInstallationParameters,
      });
    } else {
      await this.verifyAPIKey();
    }
  };

  getAPIKey = async () => {
    return this.props.sdk.app
      .getParameters()
      .then((response: AppInstallationParameters | null) => {
        return response?.imgixAPIKey;
      });
  };

  render() {
    return (
      <Workbench className={css({ margin: '80px' })}>
        <Form>
          <Heading>App Configuration</Heading>
          <Paragraph>
            Welcome to your imgix Contentful app. This is your config page.
          </Paragraph>
          <div>
            <div className="flex-container">
              <div className="flex-child">
                <TextField
                  name="API Key"
                  id="APIKey"
                  labelText="API Key"
                  value={this.state.parameters?.imgixAPIKey || ''}
                  validationMessage={this.state.validationMessage}
                  textInputProps={{
                    type: 'password',
                  }}
                  onChange={this.handleChange}
                />
              </div>
              {this.state.parameters.successfullyVerified && (
                <div className="icon">
                  <Icon icon="CheckCircle" size="tiny" color="positive" />
                </div>
              )}
            </div>
            <p className="ix-helper-text">
              Access your API key at{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://dashboard.imgix.com/api-keys"
              >
                https://dashboard.imgix.com/api-keys
              </a>
            </p>
          </div>
          <Button
            type="submit"
            buttonType="positive"
            onClick={this.onClick}
            loading={this.state.isButtonLoading}
          >
            Verify
          </Button>
        </Form>
      </Workbench>
    );
  }
}
