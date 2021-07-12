import React from 'react';
import Imgix from 'react-imgix';

import './GalleryImage.css';

interface GalleryImageProps {
  url: string;
  onClose: Function;
}

export function GalleryImage({ url, onClose }: GalleryImageProps) {
  return (
    <div className="ix-gallery-image">
      <div className="ix-gallery-image-gradient"></div>
      <Imgix
        src={url}
        width={70}
        height={70}
        imgixParams={{
          auto: 'format',
          fit: 'crop',
          crop: 'entropy',
        }}
        sizes="(min-width: 480px) calc(12.5vw - 20px)"
        htmlAttributes={{
          onClick: () => onClose(url),
        }}
      />
    </div>
  );
}
