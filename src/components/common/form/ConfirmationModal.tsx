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
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Modal.scss';
import cx from 'classnames';

export interface IConfirmationModalProps {
  className?: string;
  header: {
    id: string;
    values?: {};
  };
  body: {
    id: string;
    values?: {};
  };
  onYes: () => void;
  onNo?: () => void;
  isOpen: boolean;
}

export const ConfirmationModal = (props: IConfirmationModalProps) => {
  const {
    className,
    header: { id: headerId, values: headerValues = {} },
    body: { id: bodyId, values: bodyValues = {} },
    onYes,
    onNo,
    isOpen
  } = props;

  return (
    <Modal className={className} isOpen={isOpen} fade={false}>
      <ModalHeader>
        <div className="modal-images">
          <i className="bi bi-person-check"></i>
        </div>
        <FormattedMessage id={headerId} values={{ ...headerValues, br: <br /> }} />
      </ModalHeader>
      <ModalBody>
        <FormattedMessage id={bodyId} values={{ ...bodyValues, br: <br /> }} tagName="p" />
      </ModalBody>
      <ModalFooter className={cx({ 'justify-content-end': !onNo })}>
        {onNo && (
          <Button className="btn cancel" onClick={onNo} data-testid="cancelModalButton">
            <FormattedMessage id="common.no" />
          </Button>
        )}
        {onYes && (
          <Button className="btn btn-primary" onClick={onYes} data-testid="confirmModalButton">
            <FormattedMessage id={`${onNo ? 'common.yes' : 'common.ok'}`} />
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};
