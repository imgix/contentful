import { ReactElement } from 'react';
import { Button } from '@contentful/forma-36-react-components';
import Imgix from 'react-imgix';

import './FieldImagePreview.css';

interface FieldImagePreviewProps {
  imagePath: string;
  openDialog: Function;
  clearSelection: Function;
}

export function FieldImagePreview({
  imagePath,
  openDialog,
  clearSelection,
}: FieldImagePreviewProps): ReactElement {
  return (
    <div className="ix-field-image">
      <Imgix
        width={191}
        height={191}
        src={imagePath}
        imgixParams={{
          auto: 'format',
          fit: 'crop',
          crop: 'entropy',
        }}
      />
        <Button
          icon="Plus"
          buttonType="primary"
          onClick={() => openDialog()}
        >
          Replace
        </Button>
        <Button
          icon="Delete"
          buttonType="negative"
          onClick={() => clearSelection()}
        >
          Remove
        </Button>
    </div>
  );
}
