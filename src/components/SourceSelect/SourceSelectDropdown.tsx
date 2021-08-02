import React, { ReactElement } from 'react';

import {
  Button,
  Dropdown,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';

import { SourceProps } from '../Dialog';
import './SourceSelect.css';

interface Props {
  selectedSource: Partial<SourceProps>;
  allSources: Array<any>;
  setSource: Function;
  resetErrors: Function;
}

export function SourceSelectDropdown({
  selectedSource,
  allSources,
  setSource,
  resetErrors,
}: Props): ReactElement {
  const [isOpen, setOpen] = React.useState(false);
  const handleClick = (source: SourceProps) => {
    setOpen(false);
    setSource(source);
    resetErrors();
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      toggleElement={
        <Button
          size="small"
          buttonType="muted"
          className="ix-dropdown"
          indicateDropdown
          onClick={() => setOpen(!isOpen)}
        >
          {selectedSource.name || 'Select an imgix Source'}
        </Button>
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
