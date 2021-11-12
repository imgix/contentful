import { Component } from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';

import { SourceProps, PageProps } from '../Dialog';
import { ImageSelectButton } from '../ImageSelect/ImageSelect';
import { GridImage, ImagePlaceholder, ImagePagination } from './';

import './ImageGallery.css';

interface GalleryProps {
  selectedSource: Partial<SourceProps>;
  sdk: DialogExtensionSDK;
  pageInfo: PageProps;
  changePage: (newPageIndex: number) => void;
  assets: Array<string>;
}

interface GalleryState {
  selectedImage: string;
}

export class Gallery extends Component<GalleryProps, GalleryState> {
  constructor(props: GalleryProps) {
    super(props);

    this.state = {
      selectedImage: '',
    };
  }

  handleClick = (selectedImage: string) => this.setState({ selectedImage });

  handleSubmit = () => {
    this.props.sdk.close(this.state.selectedImage);
  };

  render() {
    const { selectedImage } = this.state;

    if (!this.props.assets.length) {
      return <ImagePlaceholder />;
    }

    return (
      <div>
        <div className="ix-gallery">
          {this.props.assets.map((url: string) => {
            return (
              <GridImage
                key={url}
                selected={selectedImage === url}
                imageSrc={url}
                handleClick={() => this.handleClick(url)}
              />
            );
          })}
        </div>
        <div className="ix-gallery-footer">
          <ImagePagination
            sourceId={this.props.selectedSource.id}
            pageInfo={this.props.pageInfo}
            changePage={this.props.changePage}
          />
          <ImageSelectButton
            hidden={!!this.props.assets.length}
            disabled={selectedImage === ''}
            handleSubmit={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}
