import { ReactElement } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';

import './ImagePlaceholder.css';

export function WebFolderPlaceholder(): ReactElement {
  return (
    <div className="ix-grid-item-placeholder">
      <Paragraph className="ix-placeholder-text">
        Select a different Source to view your visual media.
      </Paragraph>
    </div>
  );
}
