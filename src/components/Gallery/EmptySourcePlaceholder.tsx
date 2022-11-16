import { ReactElement } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';

import './ImagePlaceholder.css';

export function EmptySourcePlaceholder(): ReactElement {
  return (
    <div className="ix-grid-item-placeholder">
      <Paragraph className="ix-placeholder-text">
        Add assets to this Source by selecting Upload.
      </Paragraph>
    </div>
  );
}
