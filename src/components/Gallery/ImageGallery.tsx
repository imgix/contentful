import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Component } from 'react';

import { AssetProps, PageProps, SourceProps } from '../Dialog';
import { GridImage, ImagePlaceholder } from './';

import { ActionBar } from '../ActionBar';
import './ImageGallery.css';

interface GalleryProps {
  selectedSource: Partial<SourceProps>;
  sdk: DialogExtensionSDK;
  pageInfo: PageProps;
  changePage: (newPageIndex: number) => void;
  assets: AssetProps[];
}

interface GalleryState {
  selectedAsset: AssetProps | undefined;
}

export class Gallery extends Component<GalleryProps, GalleryState> {
  constructor(props: GalleryProps) {
    super(props);

    this.state = {
      selectedAsset: undefined,
    };
  }

  handleClick = (selectedAsset: AssetProps) => this.setState({ selectedAsset });

  handleSubmit = () => {
    this.props.sdk.close(this.state.selectedAsset);
  };

  render() {
    const { selectedAsset } = this.state;
    if (!this.props.assets.length) {
      return <ImagePlaceholder />;
    }

    return (
      <div>
        <div className="ix-gallery">
          {this.props.assets.map((asset) => {
            return (
              <GridImage
                key={asset.src}
                selected={selectedAsset?.src === asset.src}
                asset={asset}
                handleClick={() => this.handleClick(asset)}
              />
            );
          })}
        </div>
        <ActionBar
          assets={this.props.assets}
          selectedSource={this.props.selectedSource}
          handleSubmit={this.handleSubmit}
          selectedAsset={selectedAsset}
          pageInfo={this.props.pageInfo}
          changePage={this.props.changePage}
          handleClose={this.props.sdk.close}
        />
      </div>
    );
  }
}
