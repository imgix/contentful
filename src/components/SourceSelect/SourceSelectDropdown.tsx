import React, { ReactElement } from 'react';

import {
  Button,
  Dropdown,
  DropdownList,
  DropdownListItem,
  Spinner,
} from '@contentful/forma-36-react-components';

import { SourceProps } from '../Dialog';
import './SourceSelectDropdown.css';

interface Props {
  testId?: string;
  selectedSource: Partial<SourceProps>;
  allSources: Array<any>;
  setSource: Function;
  resetErrors: Function;
  disabled?: boolean;
}

export function SourceSelectDropdown({
  testId,
  selectedSource,
  allSources,
  setSource,
  resetErrors,
  disabled,
}: Props): ReactElement {
  const [isOpen, setOpen] = React.useState(false);
  const handleClick = (source: SourceProps) => {
    setOpen(false);
    setSource(source);
    resetErrors();
  };

  return (
    <Dropdown
      testId={testId}
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      toggleElement={
        !allSources.length ? (
          <Button
            size="small"
            buttonType="muted"
            className="ix-dropdown"
            disabled={true}
          >
            <Spinner />
          </Button>
        ) : (
          <Button
            size="small"
            buttonType="muted"
            className="ix-dropdown"
            indicateDropdown
            onClick={() => setOpen(!isOpen)}
            disabled={disabled}
          >
            {selectedSource.name || 'Select an imgix Source'}
          </Button>
        )
      }
    >
      <DropdownList className="ix-dropdown-list">
        {allSources.map((source: SourceProps) => (
          <DropdownListItem key={source.id} onClick={() => handleClick(source)}>
            {source.name}
          </DropdownListItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
}
