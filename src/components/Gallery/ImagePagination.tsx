import React, { ReactElement } from 'react';
import { Button, Dropdown, Icon } from '@contentful/forma-36-react-components';

import { PageProps } from '../Dialog';

import './ImagePagination.css';

interface Props {
  sourceId: string | undefined;
  pageInfo: PageProps;
}

export function ImagePagination({ sourceId, pageInfo }: Props): ReactElement {
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
            {'Page ' + pageInfo.current + ' of ' + pageInfo.totalPageCount}
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
