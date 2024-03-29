import Dialog from './';
import { render } from '@testing-library/react';

describe('Dialog component', () => {
  it('Component text exists', () => {
    const mockSdk: any = {
      parameters: {
        installation: {
          imgixAPIKey: 'test_key_123',
        },
      },
    };

    const { getByText } = render(<Dialog sdk={mockSdk} />);
    expect(getByText('imgix Source:')).toBeInTheDocument();
  });
});
