import ConfigScreen from './';
import { render } from '@testing-library/react';

describe('Config Screen component', () => {
  it('Component text exists', async () => {
    const mockSdk: any = {
      app: {
        onConfigure: jest.fn(),
        getParameters: jest.fn().mockReturnValueOnce({}),
        setReady: jest.fn(),
        getCurrentState: jest.fn(),
      },
      space: {
        getEditorInterfaces: jest.fn().mockReturnValueOnce({
          items: [],
        }),
      },
      ids: {
        app: 'test-app-id',
      },
    };
    const { getByText } = render(<ConfigScreen sdk={mockSdk} />);

    // simulate the user clicking the install button
    await mockSdk.app.onConfigure.mock.calls[0][0]();

    expect(
      getByText('Getting set up with imgix and Contentful'),
    ).toBeInTheDocument();
  });
});
