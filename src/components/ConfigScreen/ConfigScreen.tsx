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
  TextLink,
} from '@contentful/forma-36-react-components';
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
      Notification.setPosition('top', { offset: 355 });
      Notification.success(
        'Your API key was successfully confirmed! Click the Install/Save button (in the top right corner) to complete installation.',
        {
          duration: 10000,
        },
      );
      updatedInstallationParameters.successfullyVerified = true;
    } catch (error) {
      Notification.setPosition('top', { offset: 355 });
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
      <Workbench className="ix-config-container">
        <Form>
          <Heading>Getting set up with imgix and Contentful</Heading>
          <Paragraph className="ix-config-description">
            Welcome to your imgix-contentful configuration page! This
            integration will allow you to directly interface with your
            organization's{' '}
            <TextLink
              href="https://docs.imgix.com/setup/image-manager"
              target="_blank"
            >
              Image Manager
            </TextLink>{' '}
            to select and insert images into your content models.<br></br>
            <br></br>
            Before installing this integration to your Contentful workspace, you
            will need to create an API key from the{' '}
            <TextLink
              href="https://dashboard.imgix.com/api-keys"
              target="_blank"
            >
              imgix dashboard
            </TextLink>
            . For this integration to work correctly, please ensure that your
            generated key has the following permissions: <code>Sources</code>{' '}
            and <code>Image Manager Browse</code>.<br></br>
            <br></br>
            After having generated your imgix API key, paste it into the field
            below and press <code>Verify</code>. If the key is valid, complete
            set up by pressing <code>Install</code> or <code>Save</code> in the
            top right hand corner of your screen. If the key is not valid,
            please confirm your information and try again.
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
              Create and/or access your API key at{' '}
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
            disabled={this.state.parameters.imgixAPIKey?.length == 0}
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
