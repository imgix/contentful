import React from 'react';
import Field from './';
import { render } from '@testing-library/react';

describe('Field component', () => {
  it('Component text exists', () => {
    const mockSdk: any = {
      field: {
        getValue: () => {},
      },
    };

    const { getByText } = render(<Field sdk={mockSdk} />);

    expect(getByText('Select an Image')).toBeInTheDocument();
  });
});
