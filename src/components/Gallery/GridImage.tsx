import {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import Imgix, { Picture, Source } from 'react-imgix';
import { AssetProps } from '../Dialog';
import { AiAssetSVG } from '../Icons/AiAssetSVG';
import { PDFAssetSVG } from '../Icons/PDFAssetSVG';
import { UnknownAssetSVG } from '../Icons/UnknownAssetSVG';
import { VideoAssetSVG } from '../Icons/VideoAssetSVG';
import { ImageAssetSVG } from '../Icons/ImageAssetSVG';

import './GridImage.css';

export type GridImageComponentProps = {
  asset: AssetProps;
  selected: boolean;
  attributes?: { [key: string]: any; content_type: string };
  handleClick: MouseEventHandler<HTMLDivElement>;
};

export const GridImage: FunctionComponent<GridImageComponentProps> = ({
  asset,
  selected,
  handleClick,
}) => {
  const focus = selected ? ' ix-selected' : '';
  const originPath = asset.attributes.origin_path;
  const [imageDidError, setImageDidError] = useState(false);
  const handleOnImageError = () => {
    setImageDidError(true);
  };
  const GridImageAsset = () => {
    return imageDidError ? (
      <ImageAssetSVG />
    ) : (
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
        htmlAttributes={{ onError: handleOnImageError }}
      />
    );
  };
  return (
    <div
      onClick={handleClick}
      className="ix-gallery-item"
      style={{ paddingBottom: 5 }}
    >
      <div className={'ix-gallery-image-gradient' + focus}></div>
      {asset.attributes.content_type.startsWith('image') ? (
        <GridImageAsset />
      ) : asset.attributes.content_type.startsWith('video') ? (
        <VideoAssetSVG />
      ) : asset.attributes.content_type === 'application/postscript' ? (
        <AiAssetSVG />
      ) : asset.attributes.content_type === 'application/pdf' ? (
        <PDFAssetSVG />
      ) : (
        <UnknownAssetSVG />
      )}
      <h5 className="asset-filename">
        <span className="asset-filename-span">{originPath}</span>
      </h5>
    </div>
  );
};
