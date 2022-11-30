import { Button } from '@contentful/forma-36-react-components';
import { AssetProps } from '../Dialog';
import { ImagePagination } from '../Gallery';
import { ImageSelectButton } from '../ImageSelect';
import './ActionBar.css';

export type ActionBarProps = {
  assets?: AssetProps[];
  selectedAsset?: any;
  selectedSource?: { [key: string]: any };
  pageInfo?: any;
  changePage?: (pageInfo: any) => void;
  handleSubmit?: (arg: any) => void;
  handleClose: () => void;
};
export function ActionBar(props: ActionBarProps) {
  return (
    <div className="ix-action-bar">
      {props.changePage && props.selectedSource ? (
        <ImagePagination
          sourceId={props.selectedSource.id}
          pageInfo={props.pageInfo}
          changePage={props.changePage}
        />
      ) : null}
      <div className="ix-action-button-container">
        <Button
          size="small"
          buttonType="muted"
          icon="Close"
          className="ix-close-button"
          onClick={() => props.handleClose()}
        >
          Cancel
        </Button>
        {props.handleSubmit && props.assets ? (
          <ImageSelectButton
            hidden={!!props.assets.length}
            disabled={!props.selectedAsset}
            handleSubmit={props.handleSubmit}
          />
        ) : null}
      </div>
    </div>
  );
}
