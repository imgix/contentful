import React, { ReactElement } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';

import './ImagePlaceholder.css';

interface Props {}

export function ImagePlaceholder({}: Props): ReactElement {
  return (
    <div className="ix-grid-item-placeholder">
      <Paragraph className="ix-placeholder-text">
        Select a Source to view your image gallery
      </Paragraph>
    </div>
  );
}
