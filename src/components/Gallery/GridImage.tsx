import { FunctionComponent, MouseEventHandler } from 'react';
import Imgix from 'react-imgix';
import { AssetProps } from '../Dialog';

import './GridImage.css';

interface GridImageComponentProps {
  asset: AssetProps;
  selected: boolean;
  handleClick: MouseEventHandler<HTMLDivElement>;
}

export const GridImage: FunctionComponent<GridImageComponentProps> = ({
  asset,
  selected,
  handleClick,
}) => {
  const focus = selected ? ' ix-selected' : '';
  const originPath = asset.attributes.origin_path;
  return (
    <div
      onClick={handleClick}
      className="ix-gallery-item"
      style={{ paddingBottom: 5 }}
    >
      <div className={'ix-gallery-image-gradient' + focus}></div>
      <Imgix
        src={asset.src || ''}
        width={140}
        height={125}
        imgixParams={{
          auto: 'format',
          fit: 'crop',
          crop: 'entropy',
        }}
        sizes="(min-width: 480px) calc(12.5vw - 20px)"
      />
      <h5 className="asset-filename">
        <span className="asset-filename-span">{originPath}</span>
      </h5>
    </div>
  );
};
