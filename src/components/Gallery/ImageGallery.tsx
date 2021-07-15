import { Component } from 'react';
import ImgixAPI, { APIError } from 'imgix-management-js';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';

import { SourceProps, PageProps } from '../Dialog';
import { ImageSelectButton } from '../ImageSelect/ImageSelect';
import { GridImage, ImagePlaceholder, ImagePagination } from './';

import './ImageGallery.css';

interface GalleryProps {
  selectedSource: Partial<SourceProps>;
  imgix: ImgixAPI;
  sdk: DialogExtensionSDK;
  getTotalImageCount: (totalImageCount: number) => void;
  pageInfo: PageProps;
  changePage: (newPageIndex: number) => void;
}

interface GalleryState {
  fullUrls: Array<string>;
  renderPlaceholder: boolean;
  selectedImage: string;
}

export class Gallery extends Component<GalleryProps, GalleryState> {
  constructor(props: GalleryProps) {
    super(props);

    this.state = {
      fullUrls: [],
      renderPlaceholder: true,
      selectedImage: '',
    };
  }

  getImages = async () => {
    const assets = await this.props.imgix.request(
      `assets/${this.props.selectedSource?.id}?page[number]=0&page[size]=18`,
    );
    // TODO: add more explicit types for image
    this.props.getTotalImageCount(
      parseInt((assets.meta.cursor as any).totalRecords),
    );
    return assets;
  };

  getImagePaths = async () => {
    let images,
      allOriginPaths: string[] = [];

    try {
      images = await this.getImages();
    } catch (error) {
      // APIError will emit more helpful data for debugging
      if (error instanceof APIError) {
        console.error(error.toString());
      } else {
        console.error(error);
      }
      return allOriginPaths;
    }

    /*
     * Resolved requests can either return an array of objects or a single
     * object via the `data` top-level field. When parsing all enabled sources,
     * both possibilities must be accounted for.
     */
    if (images) {
      const imagesArray = Array.isArray(images.data)
        ? images.data
        : [images.data];
      imagesArray.map((image: any) =>
        // TODO: add more explicit types for image
        allOriginPaths.push(image.attributes.origin_path),
      );

      return allOriginPaths;
    } else {
      return [];
    }
  };

  /*
   * Constructs an array of imgix image URL from the selected source in the
   * application Dialog component
   */
  constructUrl(images: string[]) {
    const scheme = 'https://';
    const domain = this.props.selectedSource.name;
    const imgixDomain = '.imgix.net';

    const urls = images.map(
      (path: string) => scheme + domain + imgixDomain + path,
    );
    return urls;
  }

  /*
   * Requests and constructs fully-qualified image URLs, saving the results to
   * state
   */
  async renderImagesOrPlaceholder() {
    // if selected source, return images
    if (Object.keys(this.props.selectedSource).length) {
      const images = await this.getImagePaths();
      const fullUrls = this.constructUrl(images);
      // if at least one path, remove placeholders
      if (fullUrls.length) {
        this.setState({ fullUrls, renderPlaceholder: false });
      } else {
        // if no selected source source, render placeholders
        this.setState({ renderPlaceholder: true });
      }
    }
  }

  async componentDidMount() {
    this.renderImagesOrPlaceholder();
  }

  async componentDidUpdate(prevProps: GalleryProps) {
    if (this.props.selectedSource.id !== prevProps.selectedSource.id) {
      this.renderImagesOrPlaceholder();
    }
  }

  handleClick = (selectedImage: string) => this.setState({ selectedImage });

  handleSubmit = () => {
    this.props.sdk.close(this.state.selectedImage);
  };

  render() {
    const { fullUrls, selectedImage } = this.state;

    if (fullUrls.length === 0) {
      return <ImagePlaceholder />;
    }

    return (
      <div>
        <div className="ix-gallery">
          {fullUrls.map((url: string) => {
            return (
              <GridImage
                key={url}
                selected={selectedImage === url}
                imageSrc={url}
                handleClick={(e) => this.handleClick(url)}
              />
            );
          })}
        </div>
        <ImageSelectButton
          hidden={!!fullUrls.length}
          disabled={selectedImage === ''}
          handleSubmit={this.handleSubmit}
        />
        <ImagePagination
          sourceId={this.props.selectedSource.id}
          pageInfo={this.props.pageInfo}
          changePage={this.props.changePage}
        />
      </div>
    );
  }
}
