import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ConfirmationModal.scss';

export interface IConfirmationModalProps {
  header: {
    id: string;
    values: {};
  };
  body: {
    id: string;
    values: {};
  };
  onYes: any;
  onNo: any;
  isOpen: boolean;
}

export const ConfirmationModal = (props: IConfirmationModalProps) => {
  const { header, body, onYes, onNo, isOpen } = props;
  const headerValues = !!header && !!header.values && header.values;
  const bodyValues = !!body && !!body.values && body.values;
  return (
    <Modal isOpen={isOpen} fade={false}>
      <ModalHeader>
        <FormattedMessage id={!!header && !!header.id && header.id} values={{ ...headerValues, br: <br /> }} />
      </ModalHeader>
      <ModalBody>
        <p>
          <FormattedMessage id={!!body && !!body.id && body.id} values={{ ...bodyValues, br: <br /> }} />
        </p>
      </ModalBody>
      <ModalFooter className={`${!!onNo ? '' : 'justify-content-end'}`}>
        {!!onNo && (
          <Button className="btn cancel" onClick={onNo}>
            <FormattedMessage id="common.no" />
          </Button>
        )}
        {!!onYes && (
          <Button className="btn btn-primary" onClick={onYes}>
            <FormattedMessage id={`${!!onNo ? 'common.yes' : 'common.ok'}`} />
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};
