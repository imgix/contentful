import { Component } from 'react';
import ImgixAPI, { APIError } from 'imgix-management-js';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';

import { SourceProps } from './Dialog';
import { GalleryImage } from './GalleryImage/GalleryImage';

import './Gallery.css';

interface GalleryProps {
  selectedSource: Partial<SourceProps>;
  imgix: ImgixAPI;
  sdk: DialogExtensionSDK;
}

interface GalleryState {
  fullUrls: Array<string>;
  renderPlaceholder: boolean;
}

export default class Gallery extends Component<GalleryProps, GalleryState> {
  constructor(props: GalleryProps) {
    super(props);

    this.state = {
      fullUrls: [],
      renderPlaceholder: true,
    };
  }

  async componentDidMount() {
    this.renderImagesOrPlaceholder();
  }

  async componentDidUpdate(prevProps: GalleryProps) {
    if (this.props.selectedSource.id !== prevProps.selectedSource.id) {
      this.renderImagesOrPlaceholder();
    }
  }

  getImages = async () => {
    return await this.props.imgix.request(
      `assets/${this.props.selectedSource?.id}?page[number]=0&page[size]=18`,
    );
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



  // stores the placeholder image for the gallery or the acutal images
  images = () => {
    const numberofPlaceholders = 100;

    if (!this.state.renderPlaceholder) {
      return this.state.fullUrls.map((url: string) => (
        <div className="ix-column">
          <GalleryImage url={url} />
        </div>
      ));
    } else {
      // return an array of placerholder images
      return [...Array(numberofPlaceholders)].map((_, i) => (
        <div className="ix-column ix-placeholder">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
              <rect x="100" y="150" rx="0" ry="0" width="400" height="300" fill="#E5EBED" />
            </svg> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="140"
            height="140"
            viewBox="0 0 140 140"
          >
            <rect
              x="100"
              y="150"
              rx="0"
              ry="0"
              width="140"
              height="140"
              fill="#E5EBED"
            />
          </svg>
        </div>
      ));
    }
  };

  render() {
    return <div className="ix-gallery">{this.images()}</div>;
  }
}
