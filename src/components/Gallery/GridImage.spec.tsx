import { GridImage } from './';
import { render, RenderResult } from '@testing-library/react';
import { GridImageComponentProps } from './GridImage';
import './GridImage.css';

describe('GridImage component', () => {
  let sut: RenderResult;
  let props: GridImageComponentProps;

  beforeEach(() => {
    props = {
      asset: {
        src: 'https://sdk-test.imgix.net/girl-reading-poster.png',
        attributes: {
          origin_path: '/girl-reading-poster.png',
        },
      },
      selected: false,
      handleClick: () => {},
    };

    sut = render(<GridImage {...props} selected />);
  });

  it('Asset filename text exists', () => {
    const { getByText } = sut;
    expect(getByText(props.asset.attributes.origin_path)).toBeInTheDocument();
  });
});
