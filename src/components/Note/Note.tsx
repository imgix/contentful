import { ReactElement } from 'react';
import { Note, TextLink } from '@contentful/forma-36-react-components';

import './Note.css';

export interface INoteProps {
  type: 'primary' | 'positive' | 'negative' | 'warning';
  error: Error;
  resetErrorBoundary: () => void;
  dismissable: boolean;
}

export function IxNote({
  error,
  type,
  resetErrorBoundary,
  dismissable,
}: INoteProps): ReactElement {
  const [message, _link, ...rest] = error.message.split('$');
  const [link, title] = _link?.split('|') || ['', ''];
  const linkTitle = title?.length ? title : link;

  return (
    <div className="ix-note">
      <Note
        noteType={type}
        title={error.name}
        hasCloseButton={dismissable}
        onClose={resetErrorBoundary}
      >
        {message + ' '}
        <TextLink target="window" href={link}>
          {linkTitle}
        </TextLink>
        {' ' + rest}
      </Note>
    </div>
  );
}
