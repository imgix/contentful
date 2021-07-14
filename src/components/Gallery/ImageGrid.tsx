import { FunctionComponent } from 'react';
import Imgix from 'react-imgix';

import './ImageGrid.css';

interface ImageGridProps {
  images: string[];
  onClick: (event: any) => void;
}

export const ImageGrid: FunctionComponent<ImageGridProps> = ({
  images,
  onClick,
}) => {
  return (
    <>
      {images.map((url: string) => (
        <div className="ix-gallery-item">
          <Imgix
            src={url}
            width={140}
            height={140}
            imgixParams={{
              auto: 'format',
              fit: 'crop',
              crop: 'entropy',
            }}
            sizes="(min-width: 480px) calc(12.5vw - 20px)"
            htmlAttributes={{
              onClick: () => onClick(url),
            }}
          />
        </div>
      ))}
    </>
  );
};
