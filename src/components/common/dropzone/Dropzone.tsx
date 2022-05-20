/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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

  const isFileDropped = () => !!acceptedFile || !!rejectedFile;

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
                <FormattedMessage id="dropzone.openFileDialog" />
              </Button>
            </div>
          </section>
        )}
      </ReactDropzone>
      <div className="drop-result">
        {isFileDropped() && (
          <>
            <div className={`d-inline ${!!acceptedFile ? 'accepted-file' : 'rejected-file'}`}>
              <FormattedMessage
                id={`dropzone.${!!acceptedFile ? 'acceptedFile' : 'rejectedFile'}`}
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
