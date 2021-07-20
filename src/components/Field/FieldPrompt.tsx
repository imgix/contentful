import { ReactElement } from 'react';
import { Button } from '@contentful/forma-36-react-components';

import './FieldPrompt.css';

interface FieldPromptProps {
  openDialog: Function;
}

export function FieldPrompt({
  openDialog,
}: FieldPromptProps): ReactElement {
  return (
    <div className="ix-field-prompt">
      <Button
        className="ix-add-image-button"
        icon="Plus"
        onClick={() => openDialog()}
      >
        Add An Origin Image
      </Button>
    </div>
  );
}
