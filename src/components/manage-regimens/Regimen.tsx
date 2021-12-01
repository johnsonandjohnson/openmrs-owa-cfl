import React, { useCallback } from 'react';
import Drug from './Drug';
import ValidationError from '../common/form/ValidationError';
import ExpandableSection from '../common/expandable-section/ExpandableSection';
import cx from 'classnames';
import { connect } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { IRegimen, OnChangeHandler } from '../../shared/models/manage-regimens';
import {
  DEFAULT_DRUG_CONFIGURATION,
  DELETE_REGIMEN_MODAL,
  DRUGS,
  FIELD_REQUIRED_ERROR_MESSAGE,
  REGIMEN_NAME,
  REGIMEN_NAME_ERROR_MESSAGE
} from '../../shared/constants/manage-regimens';
import { extractEventValue } from '../../shared/util/form-util';
import { cloneDeep, uniq } from 'lodash';
import { setEditedRegimens, setRegimens, setRegimenToDelete, setConfirmationModal } from '../../redux/reducers/manage-regimens';
import { EMPTY_STRING } from '../../shared/constants/input';

interface IRegimenProps extends StateProps, DispatchProps {
  intl: IntlShape;
  regimen: IRegimen;
  regimens: IRegimen[];
  regimenIdx: number;
  isAllSectionsExpanded: boolean;
}

const Regimen = ({
  intl: { formatMessage },
  regimen: { regimenName, drugs, uuid: regimenUuid, isValid: isRegimenValid, errorMessage },
  regimens,
  editedRegimens,
  regimenIdx,
  isAllSectionsExpanded,
  setConfirmationModal,
  setRegimens,
  setEditedRegimens,
  setRegimenToDelete
}: IRegimenProps) => {
  if (!drugs.length) {
    const clonedRegimens = cloneDeep(regimens);
    clonedRegimens[regimenIdx][DRUGS].push(DEFAULT_DRUG_CONFIGURATION);
    setRegimens(clonedRegimens);
  }

  const onChangeHandler: OnChangeHandler = useCallback(
    (regimenIdx, regimenUuid) => event => {
      const clonedRegimens = cloneDeep(regimens);
      const extractedValue = extractEventValue(event);
      const isRegimenNameUnique = clonedRegimens.every(({ regimenName }) => regimenName.toLowerCase() !== extractedValue.toLowerCase());

      clonedRegimens[regimenIdx][REGIMEN_NAME] = extractedValue;
      clonedRegimens[regimenIdx].isValid = !!extractedValue;
      clonedRegimens[regimenIdx].errorMessage = EMPTY_STRING;

      if (!extractedValue) {
        clonedRegimens[regimenIdx].errorMessage = FIELD_REQUIRED_ERROR_MESSAGE;
      } else if (!isRegimenNameUnique) {
        clonedRegimens[regimenIdx].isValid = false;
        clonedRegimens[regimenIdx].errorMessage = REGIMEN_NAME_ERROR_MESSAGE;
      }

      setRegimens(clonedRegimens);
      regimenUuid && setEditedRegimens(uniq([...editedRegimens, regimenUuid]));
    },
    [regimens, setRegimens, setEditedRegimens, editedRegimens]
  );

  const onRemoveRegimenHandler = useCallback(() => {
    setRegimenToDelete({ regimenUuid, regimenIdx });
    setConfirmationModal({ open: true, type: DELETE_REGIMEN_MODAL });
  }, [regimenUuid, regimenIdx, setRegimenToDelete, setConfirmationModal]);

  const headerComponent = (disabled: boolean = false) => (
    <div className="input-container">
      <InputWithPlaceholder
        placeholder={formatMessage({ id: 'manageRegimens.regimenName' })}
        showPlaceholder={!!regimenName}
        value={regimenName}
        onChange={onChangeHandler(regimenIdx, regimenUuid)}
        className={cx({ invalid: !isRegimenValid })}
        disabled={disabled}
        data-testid="regimenHeaderInput"
      />
      {!isRegimenValid && <ValidationError message={errorMessage} />}
    </div>
  );

  const bodyComponent = drugs.map((drug, drugIdx) => (
    <Drug key={`${drug.uuid}-${drugIdx}`} drug={drug} drugIdx={drugIdx} regimenUuid={regimenUuid} regimenIdx={regimenIdx} />
  ));

  return (
    <ExpandableSection
      key={`${regimenUuid}-${regimenIdx}`}
      headerComponent={headerComponent()}
      disabledHeaderComponent={headerComponent(true)}
      bodyComponent={bodyComponent}
      isRemovable={true}
      onRemove={onRemoveRegimenHandler}
      isExpandTriggered={isAllSectionsExpanded}
    />
  );
};

const mapStateToProps = ({ manageRegimens: { regimens, editedRegimens } }) => ({
  regimens,
  editedRegimens
});

const mapDispatchToProps = {
  setRegimens,
  setEditedRegimens,
  setRegimenToDelete,
  setConfirmationModal
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Regimen));
