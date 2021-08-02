import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SelectWithPlaceholder } from '../../common/form/withPlaceholder';
import { selectDefaultTheme } from '../../../shared/util/form-util';
import '../../common/form/Modal.scss';
import '../../Inputs.scss';
import { LANGUAGE_OPTIONS } from '../../../shared/constants/vmp-translations';

export interface IAddLanguageModalProps {
  intl: any;
  languages: any[];
  isOpen: boolean;
  onYes: (language) => void;
  onNo: () => void;
}

export function AddLanguageModal(props: IAddLanguageModalProps) {
  const { intl, languages, isOpen, onYes, onNo } = props;
  const [language, setLanguage] = useState(null);
  return (
    <Modal isOpen={isOpen} fade={false}>
      <ModalHeader>
        <FormattedMessage id="vmpTranslations.addLanguage.title" />
      </ModalHeader>
      <ModalBody>
        <SelectWithPlaceholder
          placeholder={intl.formatMessage({ id: 'vmpTranslations.addLanguage.selectPlaceholder' })}
          showPlaceholder={!!language}
          value={LANGUAGE_OPTIONS.find(opt => opt.value === language) || null}
          onChange={lang => setLanguage(lang.value)}
          options={LANGUAGE_OPTIONS.filter(lang => languages.includes(lang.value))}
          wrapperClassName="flex-2"
          classNamePrefix="default-select"
          theme={selectDefaultTheme}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          className="btn cancel"
          onClick={() => {
            onNo();
            setLanguage(null);
          }}
        >
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button
          className="btn btn-primary"
          onClick={() => {
            onYes(language);
            setLanguage(null);
          }}
        >
          <FormattedMessage id="vmpTranslations.addLanguage.add" />
        </Button>
      </ModalFooter>
    </Modal>
  );
}
