import { FunctionComponent, MouseEventHandler, useState } from 'react';
import Imgix from 'react-imgix';
import { AssetProps } from '../Dialog';
import { PDFAssetSVG } from '../Icons/PDFAssetSVG';
import { UnknownAssetSVG } from '../Icons/UnknownAssetSVG';
import { VideoAssetSVG } from '../Icons/VideoAssetSVG';
import { ImageAssetSVG } from '../Icons/ImageAssetSVG';

import './GridImage.css';
import { DocumentAssetSVG } from '../Icons/DocumentAssetSVG';
import { SVGAssetSVG } from '../Icons/SVGAssetSVG';

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

  const VideoThumbnail = () => {
    const url =
      asset.src.replace('imgix.net', 'imgix.video') +
      '?video-generate=thumbnail&time=0.1';
    return url;
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

  const GridVideoAsset = () => {
    return imageDidError ? (
      <VideoAssetSVG />
    ) : (
      <Imgix
        src={VideoThumbnail() || ''}
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
    <div onClick={handleClick} className="ix-gallery-item">
      <div className={'ix-gallery-image-gradient' + focus}></div>
      {!asset.attributes.content_type ? (
        <UnknownAssetSVG />
      ) : asset.attributes.content_type.startsWith('image/svg') ? (
        <SVGAssetSVG />
      ) : asset.attributes.content_type.startsWith('image') ? (
        <GridImageAsset />
      ) : asset.attributes.content_type.startsWith('video') ? (
        <GridVideoAsset />
      ) : asset.attributes.content_type.startsWith('text') ? (
        <DocumentAssetSVG />
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
