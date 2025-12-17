import React, { ReactElement } from 'react';

import {
  Button,
  Menu,
  Spinner,
} from '@contentful/f36-components';
import { CaretUpIcon, CaretDownIcon } from '@contentful/f36-icons';

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
    <Menu isOpen={isOpen} onClose={() => setOpen(false)}>
      <Menu.Trigger>
        {!allSources.length ? (
          <Button
            size="small"
            variant="secondary"
            className="ix-dropdown"
            isDisabled={true}
          >
            <Spinner />
          </Button>
        ) : (
          <Button
            size="small"
            variant="secondary"
            className="ix-dropdown"
            endIcon={isOpen ? <CaretUpIcon /> : <CaretDownIcon />}
            onClick={() => setOpen(!isOpen)}
            isDisabled={disabled}
          >
            {selectedSource.name || 'Select an imgix Source'}
          </Button>
        )}
      </Menu.Trigger>
      <Menu.List className="ix-dropdown-list">
        {allSources.map((source: SourceProps) => (
          <Menu.Item key={source.id} onClick={() => handleClick(source)}>
            {source.name}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
}
