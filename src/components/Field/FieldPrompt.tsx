import { ReactElement } from 'react';
import { Button } from '@contentful/forma-36-react-components';

import './FieldPrompt.css';

interface FieldPromptProps {
  onClick: Function;
}

export function FieldPrompt({ onClick }: FieldPromptProps): ReactElement {
  return (
    <div className="ix-field-prompt">
      <Button
        className="ix-add-image-button"
        icon="Plus"
        onClick={() => onClick()}
      >
        Add An Origin Image
      </Button>
    </div>
  );
}
