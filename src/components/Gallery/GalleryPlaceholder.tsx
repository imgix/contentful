import { ReactElement } from 'react';
import { Paragraph, Spinner } from '@contentful/forma-36-react-components';
import { ActionBar } from '../ActionBar';
import './ImagePlaceholder.css';

export function GalleryPlaceholder({
  text,
  sdk,
}: {
  text: string;
  sdk: any;
}): ReactElement {
  return (
    <div className="ix-grid-item-placeholder">
      <Paragraph className="ix-placeholder-text">{text}</Paragraph>
      <ActionBar handleClose={sdk.close} />
      {text === 'Loading' ? <Spinner /> : null}
    </div>
  );
}
