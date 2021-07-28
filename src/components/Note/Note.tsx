import { ReactElement } from 'react';
import { Note, TextLink } from '@contentful/forma-36-react-components';

export interface INoteProps {
  type: 'primary' | 'positive' | 'negative' | 'warning';
  error: Error;
  resetErrorBoundary: () => void;
}

export function IxNote({
  error,
  type,
  resetErrorBoundary,
}: INoteProps): ReactElement {
  const [message, _link, ...rest] = error.message.split('$');
  const [link, title] = _link.split('|');
  const linkTitle = title?.length ? title : link;

  return (
    <div className="ix-note" style={{ marginTop: 25 }}>
      <Note
        noteType={type}
        title={error.name}
        hasCloseButton
        onClose={resetErrorBoundary}
      >
        {message + ' '}{' '}
        <TextLink target="window" href={link}>
          {linkTitle}
        </TextLink>{' '}
        {' ' + rest}
      </Note>
    </div>
  );
}
