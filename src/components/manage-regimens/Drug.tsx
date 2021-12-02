import React, { useCallback, useMemo } from 'react';
import ValidationError from '../common/form/ValidationError';
import cx from 'classnames';
import { connect } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { InputWithPlaceholder, SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';
import { selectDefaultTheme } from '../../shared/util/form-util';
import { IDrug, OnChangeHandler } from '../../shared/models/manage-regimens';
import { IConcept } from '../../shared/models/concept';
import { IDrugListItem } from '../../shared/models/drugs';
import { IFrequency } from '../../shared/models/order-frequency';
import { setEditedRegimens, setRegimens, setDrugToDelete, setConfirmationModal } from '../../redux/reducers/manage-regimens';
import { cloneDeep, uniq } from 'lodash';
import { extractEventValue } from '../../shared/util/form-util';
import {
  DEFAULT_DRUG_CONFIGURATION,
  DELETE_DRUG_MODAL,
  DOSE,
  DRUGS,
  DRUG_DETAILS,
  FIELD_REQUIRED_ERROR_MESSAGE
} from '../../shared/constants/manage-regimens';
import { EMPTY_STRING } from '../../shared/constants/input';

export interface IDrugProps extends StateProps, DispatchProps {
  intl: IntlShape;
  drugsList: IDrugListItem[];
  frequencies: IFrequency[];
  conceptDoseTypes: IConcept;
  regimenUuid: string;
  regimenIdx: number;
  drug: IDrug;
  drugIdx: number;
}

export const Drug = ({
  intl,
  drugsList,
  frequencies,
  conceptDoseTypes,
  regimens,
  editedRegimens,
  regimenUuid,
  regimenIdx,
  drug: { drugDetails, doseUnits, dose, frequency: drugFrequency, uuid: drugUuid },
  drugIdx,
  setRegimens,
  setEditedRegimens,
  setConfirmationModal,
  setDrugToDelete
}: IDrugProps) => {
  const { formatMessage } = intl;
  const getOptions = useMemo(
    () => (options: { display: string; uuid: string }[] = []) => options.map(option => ({ label: option?.display, value: option?.uuid })),
    []
  );
  const getValue = (value: { label: string }) => (value.label ? value : null);
  const onChangeHandler: OnChangeHandler = useCallback(
    (regimenIdx, regimenUuid, name, drugIdx) => event => {
      const clonedRegimens = cloneDeep(regimens);
      const extractedValue = extractEventValue(event);

      clonedRegimens[regimenIdx][DRUGS][drugIdx][name] = extractedValue;

      if (name === DRUG_DETAILS) {
        const { abbreviation } = drugsList.find(({ uuid }) => uuid === extractedValue.value);
        clonedRegimens[regimenIdx][DRUGS][drugIdx][name].abbreviation = abbreviation ?? EMPTY_STRING;
      }

      if (name !== DOSE) {
        clonedRegimens[regimenIdx][DRUGS][drugIdx][name].isValid = !!extractedValue;
      }

      setRegimens(clonedRegimens);
      regimenUuid && setEditedRegimens(uniq([...editedRegimens, regimenUuid]));
    },
    [regimens, setRegimens, setEditedRegimens, editedRegimens, drugsList]
  );

  const onAddDrugHandler = useCallback(() => {
    const clonedRegimens = cloneDeep(regimens);
    clonedRegimens[regimenIdx][DRUGS].push(DEFAULT_DRUG_CONFIGURATION);
    setRegimens(clonedRegimens);
  }, [regimenIdx, regimens, setRegimens]);

  const onRemoveDrugHandler = useCallback(() => {
    setDrugToDelete({ regimenUuid, regimenIdx, drugUuid, drugIdx });
    setConfirmationModal({ open: true, type: DELETE_DRUG_MODAL });
  }, [setDrugToDelete, regimenUuid, regimenIdx, drugUuid, drugIdx, setConfirmationModal]);

  return (
    <div key={`${regimenUuid}-${drugIdx}`} className="manage-regimen-row">
      <div className="input-container flex-2" data-testid="drugNameSelect">
        <SelectWithPlaceholder
          placeholder={formatMessage({ id: 'manageRegimens.drugName' })}
          showPlaceholder={!!getValue(drugDetails)}
          value={getValue(drugDetails)}
          onChange={onChangeHandler(regimenIdx, regimenUuid, 'drugDetails', drugIdx)}
          options={getOptions(drugsList)}
          wrapperClassName={cx({ invalid: !drugDetails.isValid })}
          classNamePrefix="default-select"
          theme={selectDefaultTheme}
        />
        {!drugDetails.isValid && <ValidationError message={FIELD_REQUIRED_ERROR_MESSAGE} />}
      </div>
      <div className="input-container">
        <InputWithPlaceholder
          placeholder={formatMessage({ id: 'manageRegimens.drugAbbreviation' })}
          showPlaceholder={!!drugDetails.abbreviation}
          value={drugDetails.abbreviation}
          disabled
          data-testid="abbreviationInput"
        />
      </div>
      <div className="input-container" data-testid="doseUnitsSelect">
        <SelectWithPlaceholder
          placeholder={formatMessage({ id: 'manageRegimens.doseUnitType' })}
          showPlaceholder={!!getValue(doseUnits)}
          value={getValue(doseUnits)}
          onChange={onChangeHandler(regimenIdx, regimenUuid, 'doseUnits', drugIdx)}
          options={getOptions(conceptDoseTypes?.setMembers)}
          wrapperClassName={cx({ invalid: !doseUnits.isValid })}
          classNamePrefix="default-select"
          theme={selectDefaultTheme}
        />
        {!doseUnits.isValid && <ValidationError message={FIELD_REQUIRED_ERROR_MESSAGE} />}
      </div>
      <div className="input-container">
        <InputWithPlaceholder
          placeholder={formatMessage({ id: 'manageRegimens.numberOfUnits' })}
          showPlaceholder={!!dose}
          value={dose}
          onChange={onChangeHandler(regimenIdx, regimenUuid, 'dose', drugIdx)}
          type="number"
          pattern="[1-9]"
          min={1}
          className={cx({ invalid: !Number(dose) })}
          data-testid="doseInput"
        />
        {!Number(dose) && <ValidationError message={FIELD_REQUIRED_ERROR_MESSAGE} />}
      </div>
      <div className="input-container" data-testid="frequencySelect">
        <SelectWithPlaceholder
          placeholder={formatMessage({ id: 'manageRegimens.frequency' })}
          showPlaceholder={!!getValue(drugFrequency)}
          value={getValue(drugFrequency)}
          onChange={onChangeHandler(regimenIdx, regimenUuid, 'frequency', drugIdx)}
          options={getOptions(frequencies)}
          wrapperClassName={cx({ invalid: !drugFrequency.isValid })}
          classNamePrefix="default-select"
          theme={selectDefaultTheme}
        />
        {!drugFrequency.isValid && <ValidationError message={FIELD_REQUIRED_ERROR_MESSAGE} />}
      </div>
      <PlusMinusButtons
        intl={intl}
        onPlusClick={onAddDrugHandler}
        onMinusClick={onRemoveDrugHandler}
        isPlusButtonVisible={drugIdx === regimens[regimenIdx][DRUGS].length - 1}
      />
    </div>
  );
};

const mapStateToProps = ({
  manageRegimens: { regimens, editedRegimens },
  concept: { concept: conceptDoseTypes },
  drugs: { drugsList },
  orderFrequency: { frequencies }
}) => ({
  drugsList,
  frequencies,
  conceptDoseTypes,
  regimens,
  editedRegimens
});

const mapDispatchToProps = {
  setRegimens,
  setEditedRegimens,
  setDrugToDelete,
  setConfirmationModal
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Drug));
