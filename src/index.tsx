import { render } from 'react-dom';

import {
  AppExtensionSDK,
  FieldExtensionSDK,
  DialogExtensionSDK,
  init,
  locations,
} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import '@contentful/forma-36-tokens/dist/css/index.css';

import Config from './components/ConfigScreen';
import Field from './components/Field/';
import Dialog from './components/Dialog/';

import './index.css';

if (process.env.NODE_ENV === 'development' && window.self === window.top) {
  // You can remove this if block before deploying your app
  const root = document.getElementById('root');
  const API_KEY = process.env.REACT_APP_CTFL_API_KEY;

  render(
    <div
      style={{
        display: 'block',
        width: '100%',
        border: 'none',
        minHeight: '1200px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'block', margin: '0px' }}>
        <Dialog
          sdk={
            {
              parameters: {
                invocation: {
                  selectedImage: '',
                },
                installation: {
                  imgixAPIKey: API_KEY,
                  successfullyVerified: true,
                },
              },
              close: () => {
                console.log('close');
              },
            } as any
          }
        />
      </div>
    </div>,
    root,
  );
} else {
  init((sdk) => {
    const root = document.getElementById('root');

    // All possible locations for your app
    // Feel free to remove unused locations
    // Dont forget to delete the file too :)
    const ComponentLocationSettings = [
      {
        location: locations.LOCATION_APP_CONFIG,
        component: <Config sdk={sdk as AppExtensionSDK} />,
      },
      {
        location: locations.LOCATION_ENTRY_FIELD,
        component: <Field sdk={sdk as FieldExtensionSDK} />,
      },
      {
        location: locations.LOCATION_DIALOG,
        component: <Dialog sdk={sdk as DialogExtensionSDK} />,
      },
    ];

    // Select a component depending on a location in which the app is rendered.
    ComponentLocationSettings.forEach((componentLocationSetting) => {
      if (sdk.location.is(componentLocationSetting.location)) {
        render(componentLocationSetting.component, root);
      }
    });
  });
}
