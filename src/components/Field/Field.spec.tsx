import Field from './';
import { fireEvent, render } from '@testing-library/react';

const MOCK_FIELD_VALUE = {
  src: 'https://sdk-test.imgix.net/amsterdam.jpg',
  attributes: {
    content_type: 'image/jpeg',
    media_height: 3000,
    media_kind: 'IMAGE',
    media_width: 4000,
    origin_path: '/amsterdam.jpg',
    source_id: '1234567',
  },
  selectedSource: {
    id: '1234567',
    name: 'sdk-test',
    type: 's3',
    domain: 'sdk-test',
  },
  imgixParams: {},
};

describe('Field component', () => {
  it('Component text exists', () => {
    const mockSdk: any = {
      field: {
        getValue: () => {},
      },
      window: {
        updateHeight: () => {},
      },
    };

    const { getByText } = render(<Field sdk={mockSdk} />);

    expect(getByText('Add An Origin Image')).toBeInTheDocument();
  });

  it('Renders "Add" Button when there is no previously selected asset', () => {
    const mockSdk: any = {
      field: {
        getValue: () => undefined,
      },
      window: {
        updateHeight: () => {},
      },
    };

    const { getByText } = render(<Field sdk={mockSdk} />);

    expect(getByText('Add An Origin Image')).toBeInTheDocument();
  });

  it('Renders "Replace" Button when there is a previously selected asset', () => {
    const mockAsset = MOCK_FIELD_VALUE;

    const mockSdk: any = {
      field: {
        getValue: () => mockAsset,
        setValue: jest.fn(),
      },
      window: {
        updateHeight: () => {},
      },
    };

    const { getByText } = render(<Field sdk={mockSdk} />);

    expect(getByText('Replace')).toBeInTheDocument();
  });

  it('Renders checkboxes when the asset content type is an image', () => {
    const mockAsset = MOCK_FIELD_VALUE;

    const mockSdk: any = {
      field: {
        getValue: () => mockAsset,
        setValue: jest.fn(),
      },
      window: {
        updateHeight: () => {},
      },
    };

    const { getByLabelText } = render(<Field sdk={mockSdk} />);

    expect(getByLabelText('auto=format')).toBeInTheDocument();
  });

  it('Does not render checkboxes when the asset content type is not an image', () => {
    const mockAsset = {
      ...MOCK_FIELD_VALUE,
      ...{ attributes: { content_type: 'video/mp4' } },
    };

    const mockSdk: any = {
      field: {
        getValue: () => mockAsset,
        setValue: jest.fn(),
      },
      window: {
        updateHeight: () => {},
      },
    };

    const { queryAllByText } = render(<Field sdk={mockSdk} />);

    expect(queryAllByText('auto=format').length).toBe(0);
  });

  describe('With existing imgixParams field properties', () => {
    describe('With `upscale`', () => {
      it('Renders a checked Checkbox for upscale', () => {
        const mockAsset = {
          ...MOCK_FIELD_VALUE,
          imgixParams: {
            upscale: true,
          },
        };

        const mockSdk: any = {
          field: {
            getValue: () => mockAsset,
            setValue: jest.fn(),
          },
          window: {
            updateHeight: () => {},
          },
        };

        const { getByLabelText } = render(<Field sdk={mockSdk} />);

        const upscaleCheckbox = getByLabelText('upscale');
        expect(upscaleCheckbox).toBeInTheDocument();
        expect(upscaleCheckbox).toBeChecked();
      });

      it('Renders a disabled Checkbox for bg-remove', () => {
        const mockAsset = {
          ...MOCK_FIELD_VALUE,
          imgixParams: {
            upscale: true,
          },
        };

        const mockSdk: any = {
          field: {
            getValue: () => mockAsset,
            setValue: jest.fn(),
          },
          window: {
            updateHeight: () => {},
          },
        };

        const { getByLabelText } = render(<Field sdk={mockSdk} />);

        const bgRemoveCheckbox = getByLabelText('bg-remove');
        expect(bgRemoveCheckbox).toBeInTheDocument();
        expect(bgRemoveCheckbox).toBeDisabled();
      });
    });

    describe('With `bg-remove`', () => {
      it('Renders a checked Checkbox for bg-remove', () => {
        const mockAsset = {
          ...MOCK_FIELD_VALUE,
          imgixParams: {
            'bg-remove': true,
          },
        };

        const mockSdk: any = {
          field: {
            getValue: () => mockAsset,
            setValue: jest.fn(),
          },
          window: {
            updateHeight: () => {},
          },
        };

        const { getByLabelText } = render(<Field sdk={mockSdk} />);

        const bgRemoveCheckbox = getByLabelText('bg-remove');
        expect(bgRemoveCheckbox).toBeInTheDocument();
        expect(bgRemoveCheckbox).toBeChecked();
      });

      it('Renders a disabled Checkbox for upscale', () => {
        const mockAsset = {
          ...MOCK_FIELD_VALUE,
          imgixParams: {
            'bg-remove': true,
          },
        };

        const mockSdk: any = {
          field: {
            getValue: () => mockAsset,
            setValue: jest.fn(),
          },
          window: {
            updateHeight: () => {},
          },
        };

        const { getByLabelText } = render(<Field sdk={mockSdk} />);

        const bgRemoveCheckbox = getByLabelText('upscale');
        expect(bgRemoveCheckbox).toBeInTheDocument();
        expect(bgRemoveCheckbox).toBeDisabled();
      });
    });
  });

  describe('With params in the source URL', () => {
    describe('With `auto=format`', () => {
      it('Checks auto format checkbox', () => {
        const mockAsset = {
          ...MOCK_FIELD_VALUE,
          src: 'https://sdk-test.imgix.net/amsterdam.jpg?auto=format',
          imgixParams: {
            auto: ['format'],
          },
        };

        const mockSdk: any = {
          field: {
            getValue: () => mockAsset,
            setValue: jest.fn(),
          },
          window: {
            updateHeight: () => {},
          },
        };

        const { getByLabelText } = render(<Field sdk={mockSdk} />);

        const autoFormatCheckbox = getByLabelText('auto=format');
        expect(autoFormatCheckbox).toBeInTheDocument();
        expect(autoFormatCheckbox).toBeChecked();
      });

      it('Updates searchParams when a new auto parameter is added', () => {
        const mockAsset = {
          ...MOCK_FIELD_VALUE,
          src: 'https://sdk-test.imgix.net/amsterdam.jpg?auto=format',
          imgixParams: {
            auto: ['format'],
          },
        };

        const mockSdk: any = {
          field: {
            getValue: () => mockAsset,
            setValue: jest.fn(),
          },
          window: {
            updateHeight: () => {},
          },
        };

        const { getByLabelText } = render(<Field sdk={mockSdk} />);
        const autoEnhanceCheckbox = getByLabelText('auto=enhance');

        fireEvent.click(autoEnhanceCheckbox);

        expect(mockSdk.field.setValue).toHaveBeenCalledWith({
          ...mockAsset,
          src: 'https://sdk-test.imgix.net/amsterdam.jpg?auto=format%2Cenhance',
          imgixParams: {
            auto: 'format,enhance',
          },
        });
      });

      it('Removes from the searchParams auto param in unchecked', () => {
        const mockAsset = {
          ...MOCK_FIELD_VALUE,
          src: 'https://sdk-test.imgix.net/amsterdam.jpg?auto=format%2Cenhance',
          imgixParams: {
            auto: ['format', 'enhance'],
          },
        };

        const mockSdk: any = {
          field: {
            getValue: () => mockAsset,
            setValue: jest.fn(),
          },
          window: {
            updateHeight: () => {},
          },
        };

        const { getByLabelText } = render(<Field sdk={mockSdk} />);
        const autoFormatCheckbox = getByLabelText('auto=format');

        fireEvent.click(autoFormatCheckbox);

        expect(mockSdk.field.setValue).toHaveBeenCalledWith({
          ...mockAsset,
          src: 'https://sdk-test.imgix.net/amsterdam.jpg?auto=enhance',
          imgixParams: {
            auto: 'enhance',
          },
        });
      });
    });
  });
});
