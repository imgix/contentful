export type NoteType = 'primary' | 'positive' | 'negative' | 'warning';
export type ErrorType =
  | `InvalidApiKeyError`
  | `NoSourcesError`
  | `NoOriginAssetsError`
  | `NoOriginAssetsWebFolderError`
  | `noSearchAssetsError`;

const DASHBOARD_URL = 'https://dashboard.imgix.com';
const WEBFOLDER_DOCUMENTATION_URL = `https://docs.imgix.com/setup/serving-assets#web-folder`;
const SUPPORT_URL = `https://imgix.com/contact`;

/*
* The error messages are split on `$` and then again on `|`. The `$` is used to
* parse the message's "link" url. The`|` is used to parse the message's "link"
* title. If the `message` string has no `|` then the `$` is used to parse the
* message's "link" url and title.

* E.g.
* `Return to $${APP_CONFIG_URL}|Configuration Page$ to enter a valid API key`
* Will be parsed as: 
* `Return to https://app.contentful.com/deeplink?link=apps to enter a valid
* API key`.
*/

const ERROR_MESSAGES = {
  InvalidApiKeyError: {
    message: `Return to the Configuration Page to enter a valid API Key or 
    contact your system administrator.`,
    name: 'Invalid API Key',
    type: 'negative',
    dismissable: false,
  },
  NoSourcesError: {
    message: `Go to $${DASHBOARD_URL + '/sources'}$ to add an imgix Source.`,
    name: 'You have no imgix Sources',
    type: 'warning',
    dismissable: false,
  },
  NoOriginAssetsError: {
    message: `To upload images to this Source, select the Upload button located in the top-right-hand corner of the modal.`,
    name: 'This Source has no Origin assets',
    type: 'warning',
    dismissable: false,
  },
  NoOriginAssetsWebFolderError: {
    message: `imgix couldn’t find any Origin Assets in this Web Folder. Please check back later, visit our $${WEBFOLDER_DOCUMENTATION_URL}|documentation,$ or $${SUPPORT_URL}| contact Support.$`,
    name: 'This Web Folder Source has no Origin Assets',
    type: 'warning',
    dismissable: false,
  },
  noSearchAssetsError: {
    message: `Consider trying to search for something else.`,
    name: 'No results found',
    type: 'warning',
    dismissable: true,
  }
} as const;

type ErrorMessageType = keyof typeof ERROR_MESSAGES;

/**
 * @class IxError
 * @description
 * This class is used to manage imgix API error messages and warnings. It
 * extends the builtin `Error` class and adds the `type` property.
 *
 * @param {NoteType} type "`InvalidApiKeyError` | `NoSourcesError` | `NoOriginAssetsError` | `NoOriginAssetsWebFolderError` | `noSearchAssetsError`"
 * @param {string} message The error message string.
 *
 * @example
 * const errors = [new IxError()];
 * console.log(errors[0].name);
 * // => 'imgix API Error'
 * console.log(errors[0].message);
 * // => 'Boom 💥'
 * console.log(errors[0].type);
 * // => 'negative'
 */

export class IxError extends Error {
  type: NoteType;
  dismissable: boolean;
  constructor(type: ErrorType, message?: string) {
    super(message);
    this.name =
      ERROR_MESSAGES[type as ErrorMessageType].name || 'imgix API Error';
    this.message = message || ERROR_MESSAGES[type as ErrorMessageType].message;
    this.type = ERROR_MESSAGES[type as ErrorMessageType].type || 'warning';
    this.dismissable = ERROR_MESSAGES[type as ErrorMessageType].dismissable;
    
  }
}

export const invalidApiKeyError = (message?: string) =>
  new IxError('InvalidApiKeyError', message);

export const noSourcesError = (message?: string) =>
  new IxError('NoSourcesError', message);

export const noOriginAssetsError = (message?: string) =>
  new IxError('NoOriginAssetsError', message);

export const noOriginAssetsWebFolderError = (message?: string) =>
  new IxError('NoOriginAssetsWebFolderError', message);

export const noSearchAssetsError = (message?: string) =>
  new IxError('noSearchAssetsError', message);
