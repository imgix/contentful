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
  List,
  ListItem,
  CheckboxField,
  Subheading,
} from '@contentful/forma-36-react-components';
import ImgixAPI, { APIError } from 'imgix-management-js';
import debounce from 'lodash.debounce';

import './ConfigScreen.css';

export interface AppInstallationParameters {
  imgixAPIKey?: string;
  successfullyVerified?: boolean;
}

interface CompatibleField {
  fieldId: string;
  fieldName: string;
  enabled: boolean;
}

interface ContentType {
  contentName: string;
  contentId: string;
  compatibleFields: CompatibleField[];
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  isButtonLoading?: boolean;
  validationMessage?: string;
  parameters: AppInstallationParameters;
  contentTypes: ContentType[];
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      isButtonLoading: false,
      validationMessage: '',
      parameters: {},
      contentTypes: [],
    };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters =
      (await this.props.sdk.app.getParameters()) || {};

    // Forcing the type here to include any[] as Promise.all can return `undefined`
    // but we will filter all values out before returning the final array
    const contentTypes: (ContentType | any)[] =
      await this.getContentTypesWithCompatibleFields();

    this.setState({ parameters, contentTypes }, async () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  /**
   * A function that returns all content types (e.g. Blog Posts) with any compatible fields
   * (i.e. Object) that are not configured to use the imgix app
   * @returns an array of @type ContentType objects
   */
  async getContentTypesWithCompatibleFields() {
    const { space, ids } = this.props.sdk;
    const editorInterfaces = await space.getEditorInterfaces();
    const appId = ids.app;

    /**
     * A function that returns all compatible fields for a given content type
     * @param controls
     * @param fields
     * @returns
     */
    // TODO: add more explicit types from https://github.com/contentful/apps/blob/9a06aa60c815bf674f019ddb1b9806a53ac8fb0b/packages/dam-app-base/src/AppConfig/fields.ts
    const getCompatibleFields = (controls: any[], fields: any[]) => {
      const compatibleFields: CompatibleField[] = [];
      controls?.forEach((control, index) => {
        if (control.fieldId === fields[index].id) {
          if (fields[index].type === 'Object') {
            // const enabled = control.widgetId === appId; KEEP THIS
            if (control.widgetId !== appId) {
              compatibleFields.push({
                fieldId: control.fieldId,
                fieldName: fields[index].name,
                enabled: false,
              });
            }
          }
        }
      });
      return compatibleFields;
    };

    return Promise.all(
      // TODO: add more explicit types from https://github.com/contentful/apps/blob/9a06aa60c815bf674f019ddb1b9806a53ac8fb0b/packages/dam-app-base/src/AppConfig/fields.ts
      editorInterfaces?.items?.map(async (ei: any) => {
        const contentId = ei.sys?.contentType?.sys?.id;
        const contentType: any = await space.getContentType(contentId);
        if (contentType.fields) {
          const compatibleFields = getCompatibleFields(
            ei.controls,
            contentType.fields,
          );
          if (compatibleFields.length > 0) {
            return {
              contentName: contentType.name as string,
              contentId: contentId as string,
              compatibleFields,
            };
          }
        }
      }),
    ).then((allObjectFields) =>
      allObjectFields.filter((field) => typeof field !== 'undefined'),
    );
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // ensure the API key is validated
    await this.verifyAPIKey();

    // Generate a new target state with the App assigned to the selected
    // content types
    const targetState = await this.createTargetState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters: this.state.parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState,
    };
  };

  /**
   * A function that will construct an EditorInterface object. This value is
   * is used to render the imgix app on any fields selected by the user on the
   * ConfigScreen.
   * @returns EditorInterface - for more information see https://www.contentful.com/developers/docs/extensibility/app-framework/target-state/#field-location
   */
  createTargetState = async () => {
    const currentState = await this.props.sdk.app.getCurrentState();

    const EditorInterface = this.state.contentTypes.reduce(
      (editorInterface: any, { contentId, compatibleFields }: ContentType) => {
        if (
          compatibleFields.length > 0 &&
          compatibleFields.some((field) => field.enabled)
        ) {
          editorInterface[contentId] = {
            controls: [],
          };

          compatibleFields.forEach(({ fieldId, enabled }: CompatibleField) => {
            if (enabled) {
              editorInterface[contentId].controls.push({ fieldId });
            }
          });
        }
        return editorInterface;
      },
      currentState?.EditorInterface || {},
    );

    return { ...currentState, EditorInterface };
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
      Notification.setPosition('top', { offset: 650 });
      Notification.success(
        'Your API key was successfully confirmed! Click the Install/Save button (in the top right corner) to complete installation.',
        {
          duration: 10000,
          id: 'ix-config-notification',
        },
      );
      updatedInstallationParameters.successfullyVerified = true;
    } catch (error) {
      // APIError will emit more helpful data for debugging
      if (error instanceof APIError) {
        console.error(error.toString());
      } else {
        console.error(error);
      }
      Notification.setPosition('top', { offset: 650 });
      Notification.error(
        "We couldn't verify this API Key. Confirm your details and try again.",
        {
          duration: 3000,
          id: 'ix-config-notification',
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

  debounceOnClick = debounce(this.onClick, 1000, {
    leading: true,
  });

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
        <Form className="ix-config-description">
          <Heading>Getting set up with imgix and Contentful</Heading>
          <Paragraph>
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
            generated key has the following permissions:{' '}
            <code className="ix-config-description-permissions">Sources</code>{' '}
            and{' '}
            <code className="ix-config-description-permissions">
              Image Manager Browse
            </code>
            .<br></br>
            <br></br>
            After having generated your imgix API key, paste it into the field
            below and press{' '}
            <code className="ix-config-description-green-button">Verify</code>.
          </Paragraph>
          <List className="ix-config-description-list">
            <ListItem>
              If the key is valid, complete set up by pressing{' '}
              <code className="ix-config-description-blue-buttons">
                Install
              </code>{' '}
              or{' '}
              <code className="ix-config-description-blue-buttons">Save</code>{' '}
              in the top right hand corner of the screen.
            </ListItem>
            <ListItem>
              If the key is not valid, please confirm your information and try
              again.
            </ListItem>
          </List>
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
                    autoComplete: 'new-api-key',
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
            disabled={!this.state.parameters.imgixAPIKey?.length}
            loading={this.state.isButtonLoading}
            onClick={this.debounceOnClick}
          >
            Verify
          </Button>
          {this.state.contentTypes.length > 0 && (
            <div>
              <hr></hr>
              <Heading>Assign to fields</Heading>
              <Paragraph>
                This app can only be used with <strong>JSON object</strong>{' '}
                fields. Select which JSON fields you’d like to enable for this
                app.
              </Paragraph>
              <br></br>
              {this.state.contentTypes.map(
                (
                  { contentName, contentId, compatibleFields }: ContentType,
                  contentIndex,
                ) => (
                  <div key={contentId}>
                    <Subheading>{contentName}</Subheading>
                    <br></br>
                    <Form>
                      {compatibleFields.map(
                        (
                          { fieldId, fieldName, enabled }: CompatibleField,
                          fieldIndex,
                        ) => (
                          <CheckboxField
                            key={contentId + '-' + fieldId}
                            labelText={fieldName}
                            id={fieldId}
                            helpText={`FieldId: ${fieldId}`}
                            checked={enabled}
                            onChange={() => {
                              // flip the enabled value of the selected field
                              const changedState = { ...this.state };
                              changedState.contentTypes[
                                contentIndex
                              ].compatibleFields[fieldIndex].enabled = !enabled;
                              this.setState(changedState);
                            }}
                          />
                        ),
                      )}
                    </Form>
                  </div>
                ),
              )}
            </div>
          )}
        </Form>
        <div className="ix-config-footer">
          <img
            className="ix-config-footerLogo"
            src="https://assets.imgix.net/sdk-imgix-logo.svg"
            alt="App logo"
          />
        </div>
      </Workbench>
    );
  }
}
