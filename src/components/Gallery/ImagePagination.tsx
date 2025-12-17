import React, { ReactElement } from 'react';
import {
  Button,
  Menu,
} from '@contentful/f36-components';
import { CaretUpIcon, CaretDownIcon } from '@contentful/f36-icons';

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
  let leftDisabled = pageInfo.currentIndex === 0;
  let rightDisabled = pageInfo.currentIndex === pageInfo.totalPageCount - 1;

  const handleDropdownClick = (newPageIndex: number) => {
    setOpen(false);
    changePage(newPageIndex);
  };

  const paginateForward = () => {
    const nextPage = pageInfo.currentIndex + 1;
    if (nextPage < pageInfo.totalPageCount) {
      changePage(nextPage);
    }
  };

  const paginateBackward = () => {
    const prevPage = pageInfo.currentIndex - 1;
    if (prevPage >= 0) {
      changePage(prevPage);
    }
  };

  if (sourceId === undefined) {
    // return react fragment if no sourceId is provided
    return <></>;
  }
  return (
    <div className="ix-pagination">
      <Button
        className="ix-pagination-button ix-pagination-prevButton"
        variant="secondary"
        size="small"
        isDisabled={leftDisabled}
        onClick={paginateBackward}
      >
        Prev Page
      </Button>
      <Menu isOpen={isOpen} onClose={() => setOpen(false)}>
        <Menu.Trigger>
          <Button
            size="small"
            variant="secondary"
            className="ix-pagination-button ix-pagination-dropdownButton"
            endIcon={isOpen ? <CaretUpIcon /> : <CaretDownIcon />}
            onClick={() => setOpen(!isOpen)}
          >
            {`Page ${pageInfo.currentIndex + 1} of ${pageInfo.totalPageCount}`}
          </Button>
        </Menu.Trigger>
        <Menu.List className="ix-pagination-dropdown" style={{ maxHeight: 111, overflowY: 'auto' }}>
          {/* a maxHeight of 111 is the minimum height to fit 3 entries without
          needing to scroll */}
          {[...Array(pageInfo.totalPageCount)].map((_, _pageIndex) => {
            const pageIndex = _pageIndex + 1;
            return (
              <Menu.Item
                key={`page-${pageIndex}`}
                onClick={() => handleDropdownClick(_pageIndex)}
              >
                {'Page ' + pageIndex}
              </Menu.Item>
            );
          })}
        </Menu.List>
      </Menu>
      <Button
        className="ix-pagination-button ix-pagination-nextButton"
        variant="secondary"
        size="small"
        isDisabled={rightDisabled}
        onClick={paginateForward}
      >
        Next Page
      </Button>
    </div>
  );
}
