/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
  UNIQUE_REGIMEN_NAME_ERROR_MESSAGE
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
  isAllSectionsExpanded
}: IRegimenProps) => {
  if (!drugs.length) {
    const clonedRegimens = cloneDeep(regimens);
    clonedRegimens[regimenIdx][DRUGS].push(DEFAULT_DRUG_CONFIGURATION);
    setRegimens(clonedRegimens);
  }

  const onChangeHandler: OnChangeHandler = useCallback(
    (eventRegimenIdx, eventRegimenUuid) => event => {
      const clonedRegimens = cloneDeep(regimens);
      const extractedValue = extractEventValue(event);
      const isRegimenNameUnique = clonedRegimens.every(clonedRegimen => clonedRegimen.regimenName.toLowerCase() !== extractedValue.toLowerCase());

      clonedRegimens[eventRegimenIdx][REGIMEN_NAME] = extractedValue;
      clonedRegimens[eventRegimenIdx].isValid = !!extractedValue;
      clonedRegimens[eventRegimenIdx].errorMessage = EMPTY_STRING;

      if (!extractedValue) {
        clonedRegimens[eventRegimenIdx].errorMessage = FIELD_REQUIRED_ERROR_MESSAGE;
      } else if (!isRegimenNameUnique) {
        clonedRegimens[eventRegimenIdx].isValid = false;
        clonedRegimens[eventRegimenIdx].errorMessage = UNIQUE_REGIMEN_NAME_ERROR_MESSAGE;
      } else {
        // Do nothing
      }

      setRegimens(clonedRegimens);
      eventRegimenUuid && setEditedRegimens(uniq([...editedRegimens, eventRegimenUuid]));
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
