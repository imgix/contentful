import ImgixAPI from 'imgix-management-js';
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


  render() {
    return (
      <div className="gallery">
      </div>
    );
  }
}
