import { ReactElement, useState } from 'react';
import { Button } from '@contentful/forma-36-react-components';
import Imgix from 'react-imgix';

import './FieldImagePreview.css';
import { UnknownAssetSVG } from '../Icons/UnknownAssetSVG';
import { SVGAssetSVG } from '../Icons/SVGAssetSVG';
import { DocumentAssetSVG } from '../Icons/DocumentAssetSVG';
import { PDFAssetSVG } from '../Icons/PDFAssetSVG';
import { ImageAssetSVG } from '../Icons/ImageAssetSVG';

interface FieldImagePreviewProps {
  imagePath: string;
  contentType: string;
  updateHeight: Function;
  openDialog: Function;
  clearSelection: Function;
}

export function FieldImagePreview({
  imagePath,
  contentType,
  openDialog,
  updateHeight,
  clearSelection,
}: FieldImagePreviewProps): ReactElement {
  updateHeight(311);
  const [imageDidError, setImageDidError] = useState(false);

  const handleOnImageError = () => {
    setImageDidError(true);
  };

  const FieldImage = () =>
    imageDidError ? (
      <ImageAssetSVG />
    ) : (
      <Imgix
        width={230}
        height={230}
        src={imagePath}
        imgixParams={{
          auto: 'format',
          fit: 'crop',
          crop: 'entropy',
        }}
        htmlAttributes={{ onError: handleOnImageError }}
      />
    );

  const FieldVideo = () =>
    imageDidError ? (
      <ImageAssetSVG />
    ) : (
      <Imgix
        src={
          imagePath.replace('imgix.net', 'imgix.video') +
          '?video-generate=thumbnail&time=0.1'
        }
        width={230}
        height={230}
        imgixParams={{
          auto: 'format',
          fit: 'crop',
          crop: 'entropy',
        }}
        sizes="(min-width: 480px) calc(12.5vw - 20px)"
        htmlAttributes={{ onError: handleOnImageError }}
      />
    );

  return (
    <div className="ix-field-image-preview">
      {!contentType ? (
        <UnknownAssetSVG />
      ) : contentType.startsWith('image/svg') ? (
        <SVGAssetSVG />
      ) : contentType.startsWith('image') ? (
        <FieldImage />
      ) : contentType.startsWith('video') ? (
        <FieldVideo />
      ) : contentType.startsWith('text') ? (
        <DocumentAssetSVG />
      ) : contentType === 'application/pdf' ? (
        <PDFAssetSVG />
      ) : (
        <UnknownAssetSVG />
      )}
      <div className="ix-field-image-preview-buttons">
        <Button
          className="ix-field-image-preview-buttons-replace"
          icon="Plus"
          buttonType="primary"
          onClick={() => openDialog()}
        >
          Replace
        </Button>
        <Button
          className="ix-field-image-preview-buttons-remove"
          icon="Delete"
          buttonType="negative"
          onClick={() => clearSelection()}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
