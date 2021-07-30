import { ReactElement } from 'react';
import { Button, Paragraph } from '@contentful/forma-36-react-components';

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
      <Button
        className="ix-close-button"
        icon="Close"
        buttonType="naked"
        size="small"
        onClick={() => handleClose(selectedImage)}
      ></Button>
    </div>
  );
}
