import Field from './';
import { render } from '@testing-library/react';

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
});
