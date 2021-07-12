import { useState } from 'react';

import { Button } from '@contentful/forma-36-react-components';

import './GalleryImageSelectButton.css';

interface GalleryImageSelectButtonProps {
  handleClick: Function; // Called when the button is clicked
  disabled: boolean; // Whether the button is disabled
  hidden: boolean; // Whether the button is hidden
}

export function GalleryImageSelectButton({
  handleClick,
  disabled,
  hidden,
}: GalleryImageSelectButtonProps) {
  const [isSelected, setSelected] = useState(false);

  const onClick = (e: any) => {
    setSelected(!isSelected);
    return handleClick(e);
  };

  return (
    <div className={hidden ? 'ix-gallery-select hidden' : 'ix-gallery-select'}>
      <div className="ix-gallery-select-button">
        <Button
          size="small"
          disabled={disabled}
          onClick={onClick}
          buttonType={disabled ? 'muted' : 'primary'}
        >
          Select image
        </Button>
      </div>
    </div>
  );
}
