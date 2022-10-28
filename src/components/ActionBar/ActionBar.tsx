import { AssetProps } from '../Dialog';
import { ImagePagination } from '../Gallery';
import { ImageSelectButton } from '../ImageSelect';
import './ActionBar.css';

export type ActionBarProps = {
  assets: AssetProps[];
  selectedAsset: any;
  selectedSource: { [key: string]: any };
  pageInfo: any;
  changePage: (pageInfo: any) => void;
  handleSubmit: (arg: any) => void;
};
export function ActionBar(props: ActionBarProps) {
  return (
    <div className="ix-action-bar">
      <ImagePagination
        sourceId={props.selectedSource.id}
        pageInfo={props.pageInfo}
        changePage={props.changePage}
      />
      <ImageSelectButton
        hidden={!!props.assets.length}
        disabled={props.selectedAsset?.src === ''}
        handleSubmit={props.handleSubmit}
      />
    </div>
  );
}
