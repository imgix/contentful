import { FunctionComponent, MouseEventHandler } from 'react';
import Imgix from 'react-imgix';

import './GridImage.css';

interface GridImageComponentProps {
  imageSrc: string;
  selected: boolean;
  handleClick: MouseEventHandler<HTMLDivElement>;
}

export const GridImage: FunctionComponent<GridImageComponentProps> = ({
  imageSrc,
  selected,
  handleClick,
}) => {
  const focus = selected ? ' ix-selected' : '';
  return (
    <div onClick={handleClick} className="ix-gallery-item">
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
      />
    </div>
  );
};
