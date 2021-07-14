import React, { ReactElement } from 'react';

import {
  Button,
  Dropdown,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';

import { SourceProps } from '../Dialog';

interface Props {
  selectedSource: Partial<SourceProps>;
  allSources: Array<any>;
  setSource: Function;
}

export function SourceSelectDropdown({
  selectedSource,
  allSources,
  setSource,
}: Props): ReactElement {
  const [isOpen, setOpen] = React.useState(false);
  const handleClick = (source: SourceProps) => {
    setOpen(false);
    setSource(source);
  };

  return (
    <Dropdown
      className="ix-dropdown"
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      toggleElement={
        <Button
          size="small"
          buttonType="muted"
          indicateDropdown
          onClick={() => setOpen(!isOpen)}
        >
          {selectedSource.name || 'Select an imgix Source'}
        </Button>
      }
    >
      <DropdownList>
        {allSources.map((source: SourceProps) => (
          <DropdownListItem key={source.id} onClick={() => handleClick(source)}>
            {source.name}
          </DropdownListItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
}
