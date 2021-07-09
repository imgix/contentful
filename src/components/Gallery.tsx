import ImgixAPI, { APIError } from 'imgix-management-js';
import { Component } from 'react';
import Imgix from 'react-imgix';
import { SourceProps } from './Dialog';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
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

  getImages = async () => {
    return await this.props.imgix.request(
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
  async renderImages() {
    const images = await this.getImagePaths();
    const fullUrls = this.constructUrl(images);
    this.setState({ fullUrls });
  }

  async componentDidMount() {
    this.renderImages();
  }

  async componentDidUpdate(prevProps: GalleryProps) {
    if (this.props.selectedSource.id !== prevProps.selectedSource.id) {
      this.renderImages();
    }
  }

  // stores the placeholder image for the gallery or the acutal images
  images = () => {
    const numberofPlaceholders = 18;

    if (!this.state.renderPlaceholder) {
      return this.state.fullUrls.map((url: string) => (
        <div className="ix-column">
          <Imgix
            src={url}
            // width={100}
            // height={100}
            width={70}
            height={70}
            imgixParams={{
              auto: 'format',
              fit: 'crop',
              crop: 'entropy',
            }}
            sizes="(min-width: 480px) calc(12.5vw - 20px)"
            htmlAttributes={{
              onClick: () => this.props.sdk.close(url),
            }}
          />
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
    return (
      <div className="ix-row">
        {this.state.fullUrls.length > 0 &&
          this.state.fullUrls.map((url: string) => (
            <div className="ix-column">
              <Imgix
                src={url}
                width={100}
                height={100}
                imgixParams={{
                  auto: 'format',
                  fit: 'crop',
                  crop: 'entropy',
                }}
                sizes="(min-width: 480px) calc(12.5vw - 20px)"
                htmlAttributes={{
                  onClick: () => this.props.sdk.close(url),
                }}
              />
            </div>
          ))}
      </div>
    );
  }
}
