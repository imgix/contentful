import React, { ReactElement } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';

import './ImagePlaceholder.css';

export function ImagePlaceholder(): ReactElement {
  return (
    <div className="ix-grid-item-placeholder">
      <Paragraph className="ix-placeholder-text">
        Select a Source to view your image gallery
      </Paragraph>
    </div>
  );
}
