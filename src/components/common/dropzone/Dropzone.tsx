import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import ReactDropzone from 'react-dropzone';
import './Dropzone.scss';
import '../../Inputs.scss';

export default function Dropzone({ acceptedFileExt, instructionMessageId, onFileAccepted }) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [acceptedFile, setAcceptedFile] = React.useState(null);
  const [rejectedFile, setRejectedFile] = React.useState(null);
  return (
    <>
      <ReactDropzone
        accept={acceptedFileExt}
        multiple={false}
        onDropAccepted={file => {
          setAcceptedFile(file.find(Boolean));
          setRejectedFile(null);
          setIsDragActive(false);
          onFileAccepted(file.find(Boolean));
        }}
        onDropRejected={file => {
          setAcceptedFile(null);
          setRejectedFile(file.find(Boolean));
          setIsDragActive(false);
          onFileAccepted(null);
        }}
        onDragEnter={() => setIsDragActive(true)}
        onDragLeave={() => setIsDragActive(false)}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ className: isDragActive ? 'dropzone dropzone-active' : 'dropzone' })}>
              <input {...getInputProps()} />
              <div className="dropzone-instruction">
                <FormattedMessage id={instructionMessageId} />
              </div>
              <Button>
                <FormattedMessage id="vmp.dropzone.openFileDialog" />
              </Button>
            </div>
          </section>
        )}
      </ReactDropzone>
      <div className="drop-result">
        {(!!acceptedFile || !!rejectedFile) && (
          <>
            <div className={`d-inline ${!!acceptedFile ? 'accepted-file' : 'rejected-file'}`}>
              <FormattedMessage
                id={`vmp.dropzone.${!!acceptedFile ? 'acceptedFile' : 'rejectedFile'}`}
                values={{ b: (...text) => <b>{text}</b> }}
              />
            </div>
            <p className="d-inline ml-2">{!!acceptedFile ? acceptedFile.name : rejectedFile.file.name}</p>
          </>
        )}
      </div>
    </>
  );
}
