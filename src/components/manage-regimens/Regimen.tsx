import React, { useCallback } from 'react';
import Drug from './Drug';
import ValidationError from '../common/form/ValidationError';
import ExpandableSection from '../common/expandable-section/ExpandableSection';
import { connect } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { IRegimen, OnChangeHandler } from '../../shared/models/manage-regimens';
import { DEFAULT_DRUG_CONFIGURATION, DELETE_REGIMEN_MODAL, DRUGS, REGIMEN_NAME } from '../../shared/constants/manage-regimens';
import { extractEventValue } from '../../shared/util/form-util';
import { cloneDeep, uniq } from 'lodash';
import { setEditedRegimens, setRegimens, setRegimenToDelete, setConfirmationModal } from '../../redux/reducers/manage-regimens';

interface IRegimenProps extends StateProps, DispatchProps {
  intl: IntlShape;
  regimen: IRegimen;
  regimens: IRegimen[];
  regimenIdx: number;
  isAllSectionsExpanded: boolean;
}

const Regimen: React.FC<IRegimenProps> = ({
  intl: { formatMessage },
  regimen: { regimenName, drugs, uuid: regimenUuid, isValid: isRegimenValid },
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

      clonedRegimens[regimenIdx][REGIMEN_NAME] = extractedValue;
      clonedRegimens[regimenIdx].isValid = true;

      if (!extractedValue) {
        clonedRegimens[regimenIdx].isValid = false;
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

  const headerComponent = (
    <div className="input-container flex-1">
      <InputWithPlaceholder
        placeholder={formatMessage({ id: 'manageRegimens.regimenName' })}
        showPlaceholder={!!regimenName}
        value={regimenName}
        onChange={onChangeHandler(regimenIdx, regimenUuid)}
        className={!isRegimenValid ? 'invalid' : ''}
        data-testid="regimenHeaderInput"
      />
      {!isRegimenValid && <ValidationError message="common.error.required" />}
    </div>
  );

  const disableHeaderComponent = (
    <div className="input-container flex-1">
      <InputWithPlaceholder
        placeholder={formatMessage({ id: 'manageRegimens.regimenName' })}
        showPlaceholder={!!regimenName}
        value={regimenName}
        wrapperClassName="flex-1"
        className={!isRegimenValid ? 'invalid' : ''}
        disabled
        data-testid="regimenHeaderDisabledInput"
      />
      {!isRegimenValid && <ValidationError message="common.error.required" />}
    </div>
  );

  const bodyComponent = drugs.map((drug, drugIdx) => (
    <Drug key={`${drug.uuid}-${drugIdx}`} drug={drug} drugIdx={drugIdx} regimenUuid={regimenUuid} regimenIdx={regimenIdx} />
  ));

  return (
    <ExpandableSection
      key={`${regimenUuid}-${regimenIdx}`}
      headerComponent={headerComponent}
      disabledHeaderComponent={disableHeaderComponent}
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
