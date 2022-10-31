import { useRef } from 'react';

import { Button } from '@contentful/forma-36-react-components';
import './UploadButton.css';

export function UploadButton(props: {
  handleFileChange: (
    fileObject: any,
    previewSource: string,
    isUploading: boolean,
  ) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    // open file input box
    inputRef?.current?.click();
  };

  const handleFileChange = (event: any) => {
    const inputEle = event?.target as HTMLInputElement;
    // store the fileObject for later use
    const fileObj = inputEle.files && inputEle.files[0];
    if (!fileObj) {
      return;
    }

    const previewSource = URL.createObjectURL(fileObj);

    props.handleFileChange(fileObj, previewSource, true);

    // TODO: trigger a file editor modal
    // and pass the modal the file object

    // reset the input field value
    inputEle.value = '';
  };

  return (
    <div>
      <Button
        buttonType="positive"
        className="ix-uploadButton"
        icon="Download"
        type="submit"
        disabled={props.disabled}
        onClick={handleClick}
      >
        Upload
      </Button>
      <input
        id="ix-file-upload"
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
