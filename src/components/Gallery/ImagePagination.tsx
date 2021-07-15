import React, { ReactElement } from 'react';
import {
  Button,
  Dropdown,
  DropdownList,
  DropdownListItem,
  Icon,
} from '@contentful/forma-36-react-components';

import { PageProps } from '../Dialog';

import './ImagePagination.css';

interface Props {
  sourceId: string | undefined;
  pageInfo: PageProps;
  changePage: (newIndex: number) => void;
}

export function ImagePagination({
  sourceId,
  pageInfo,
  changePage,
}: Props): ReactElement {
  const [isOpen, setOpen] = React.useState(false);
  const handleDropdownClick = (newPageIndex: number) => {
    setOpen(false);
    changePage(newPageIndex);
  };

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
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        toggleElement={
          <Button
            size="small"
            buttonType="muted"
            indicateDropdown
            onClick={() => setOpen(!isOpen)}
          >
            {'Page ' + pageInfo.current + ' of ' + pageInfo.totalPageCount}
          </Button>
        }
      >
        <DropdownList maxHeight={111}>
          {/* a maxHeight of 111 is the minimum height to fit 3 entries without
          needing to scroll */}
          {[...Array(pageInfo.totalPageCount)].map((_, _pageIndex) => {
            const pageIndex = _pageIndex + 1;
            return (
              <DropdownListItem
                key={`page-${pageIndex}`}
                onClick={() => handleDropdownClick(pageIndex)}
              >
                {'Page ' + pageIndex}
              </DropdownListItem>
            );
          })}
        </DropdownList>
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
