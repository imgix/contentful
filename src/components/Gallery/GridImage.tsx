import { FunctionComponent } from 'react';
import Imgix from 'react-imgix';

import './GridImage.css';

interface GridImageComponentProps {
  imageSrc: string;
  selected: boolean;
  onClick: (event: any) => void;
}

export const GridImage: FunctionComponent<GridImageComponentProps> = ({
  imageSrc,
  selected,
  onClick,
}) => {
  const focus = selected ? ' ix-selected' : '';
  return (
    <div className="ix-gallery-item">
      <div className={'ix-gallery-image-gradient' + focus}></div>
      <Imgix
        src={imageSrc}
        width={140}
        height={140}
        imgixParams={{
          auto: 'format',
          fit: 'crop',
          crop: 'entropy',
        }}
        sizes="(min-width: 480px) calc(12.5vw - 20px)"
        htmlAttributes={{
          onClick: () => onClick(imageSrc),
        }}
      />
    </div>
  );
};
