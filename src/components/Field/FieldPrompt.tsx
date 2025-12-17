import { ReactElement } from 'react';
import { Button } from '@contentful/f36-components';

import './FieldPrompt.css';

interface FieldPromptProps {
  openDialog: Function;
  updateHeight: Function;
}

export function FieldPrompt({
  openDialog,
  updateHeight,
}: FieldPromptProps): ReactElement {
  updateHeight(150);
  return (
    <div className="ix-field-prompt">
      <Button
        className="ix-add-image-button"
        onClick={() => openDialog()}
      >
        Add An Origin Image
      </Button>
    </div>
  );
}
