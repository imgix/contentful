import React, { ReactElement } from 'react';
import { Button, Dropdown, Icon } from '@contentful/forma-36-react-components';

import './Pagination.css';

interface Props {
  totalImageCount: number;
  sourceId: string | undefined;
}

export function Pagination({ totalImageCount, sourceId }: Props): ReactElement {
  if (sourceId == undefined) {
    // return react fragment if no sourceId is provided
    return <></>;
  }
  return (
    <div className="ix-pagination">
      <Button buttonType="muted" icon="ChevronLeft" size="small">
        Prev Page
      </Button>
      <Dropdown
        toggleElement={
          <Button size="small" buttonType="muted" indicateDropdown>
            {'Page 1 of '} {Math.ceil(totalImageCount / 18)}
          </Button>
        }
      >
        {/* placeholder */}
      </Dropdown>
      <Button buttonType="muted" size="small">
        <div className="ix-next-page-button">
          Next Page
          <Icon
            className="ix-chevron-right"
            color="secondary"
            icon="ChevronRight"
          />
        </div>
      </Button>
    </div>
  );
}
