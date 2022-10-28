import { Paragraph } from '@contentful/forma-36-react-components';
import { ReactElement } from 'react';

import './DialogHeader.css';

type selectedImageType = string | undefined;

interface DialogHeaderProps {
  handleClose: (selectedImage: selectedImageType) => void;
  selectedImage: selectedImageType;
}

export function DialogHeader({
  handleClose,
  selectedImage,
}: DialogHeaderProps): ReactElement {
  return (
    <div className="ix-header-container">
      <Paragraph className="ix-title">imgix Source:</Paragraph>
    </div>
  );
}
