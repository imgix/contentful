import ImgixAPI, { APIError } from 'imgix-management-js';
import { Component } from 'react';
import { SourceProps } from './Dialog';

interface GalleryProps {
  selectedSource: Partial<SourceProps>;
  imgix: ImgixAPI;
}

interface GalleryState {
  imgix: ImgixAPI;
  fullUrls: Array<string>;
}

export default class Gallery extends Component<GalleryProps, GalleryState> {
  constructor(props: GalleryProps) {
    super(props);

    this.state = {
      imgix: props.imgix,
      fullUrls: [],
    };
  }

  getImages = async () => {
    return await this.state.imgix.request(
      `assets/${this.props.selectedSource?.id}`,
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
    const imagesArray = Array.isArray(images.data)
      ? images.data
      : [images.data];
    imagesArray.map((image: any) =>
      // TODO: add more explicit types for image
      allOriginPaths.push(image.attributes.origin_path),
    );

    return allOriginPaths;
  };

  render() {
    return (
      <div className="gallery">
      </div>
    );
  }
}
