import { useState } from 'react';
import { Button } from '@contentful/forma-36-react-components';

interface ImageSelectProps {
  handleSubmit: Function; // Called when the button is clicked
  disabled: boolean; // Whether the button is disabled
  hidden: boolean; // Whether the button is hidden
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
    <div
      className={
        hidden
          ? 'ix-gallery-image-select-button hidden'
          : 'ix-gallery-image-select-button'
      }
    >
      <Button
        size="small"
        buttonType="primary"
        icon="Plus"
        disabled={disabled}
        onClick={handleClick}
      >
        Add image
      </Button>
    </div>
  );
}
