import React, { ReactElement } from 'react';
import { Button, Paragraph } from '@contentful/forma-36-react-components';

import './DialogHeader.css';

interface Props {
  handleClose: () => void;
}

export function DialogHeader({ handleClose }: Props): ReactElement {
  return (
    <div className="ix-header-container">
      <Paragraph className="ix-title">imgix Source:</Paragraph>
      <Button
        className="ix-close-button"
        icon="Close"
        buttonType="naked"
        size="small"
        onClick={() => handleClose()}
      ></Button>
    </div>
  );
}
