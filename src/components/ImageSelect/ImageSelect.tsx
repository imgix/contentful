import { useState } from 'react';
import { Button } from '@contentful/forma-36-react-components';

import './ImageSelect.css';

interface ImageSelectProps {
  handleSubmit: Function; // Called when the button is clicked
  disabled: boolean; // Whether the button is disabled
  hidden?: boolean; // Whether the button is hidden
}

export function ImageSelectButton({
  handleSubmit,
  disabled,
  hidden,
}: ImageSelectProps) {
  const [isSelected, setSelected] = useState(false);

  const handleClick = (e: any) => {
    setSelected(!isSelected);
    return handleSubmit();
  };

  return (
    <Button
      size="small"
      buttonType="primary"
      className={hidden ? 'ix-select-addButton' : 'ix-select-addButton_hidden'}
      icon="Plus"
      disabled={disabled}
      onClick={handleClick}
    >
      Add Selected Asset
    </Button>
  );
}
