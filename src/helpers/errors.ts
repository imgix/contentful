export type NoteType = 'primary' | 'positive' | 'negative' | 'warning';
export type ErrorType =
  | `InvalidApiKeyError`
  | `NoSourcesError`
  | `NoOriginImagesError`
  | `noSearchImagesError`;

const DASHBOARD_URL = 'https://dashboard.imgix.com';

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
  },
  NoSourcesError: {
    message: `Go to $${DASHBOARD_URL + '/sources'}$ to add an imgix Source.`,
    name: 'You have no imgix Sources',
    type: 'warning',
  },
  NoOriginImagesError: {
    message: `Go to $${DASHBOARD_URL + '/sources'}$ to add Origin images to this Source.`,
    name: 'This Source has no Origin images',
    type: 'warning',
  },
  noSearchImagesError: {
    message: `Consider trying to search by something else.`,
    name: 'No results found',
    type: 'warning',
  }
} as const;

type ErrorMessageType = keyof typeof ERROR_MESSAGES;

/**
 * @class IxError
 * @description
 * This class is used to manage imgix API error messages and warnings. It
 * extends the builtin `Error` class and adds the `type` property.
 *
 * @param {NoteType} type "`InvalidApiKeyError` | `NoSourcesError` | `NoOriginImagesError` | `noSearchImagesError`"
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
  constructor(type: ErrorType, message?: string) {
    super(message);
    this.name =
      ERROR_MESSAGES[type as ErrorMessageType].name || 'imgix API Error';
    this.message = message || ERROR_MESSAGES[type as ErrorMessageType].message;
    this.type = ERROR_MESSAGES[type as ErrorMessageType].type || 'warning';
  }
}

export const invalidApiKeyError = (message?: string) =>
  new IxError('InvalidApiKeyError', message);

export const noSourcesError = (message?: string) =>
  new IxError('NoSourcesError', message);

export const noOriginImagesError = (message?: string) =>
  new IxError('NoOriginImagesError', message);

export const noSearchImagesError = (message?: string) =>
  new IxError('noSearchImagesError', message);
