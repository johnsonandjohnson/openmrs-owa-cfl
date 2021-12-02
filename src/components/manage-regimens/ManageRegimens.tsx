import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Regimen from './Regimen';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Button, Spinner } from 'reactstrap';
import {
  DRUG_DOSING_UNITS_SETTING_KEY,
  DEFAULT_MANAGE_REGIMEN_CONFIGURATION,
  DEFAULT_DRUG_CONFIGURATION,
  DRUGS,
  DRUG_ORDER_TEMPLATE_TYPE,
  INITIAL_REGIMEN_VALUE,
  INITIAL_DRUG_VALUE,
  DELETE_REGIMEN_MODAL,
  DELETE_DRUG_MODAL,
  CLOSED_MODAL_CONFIGURATION,
  DRUG_ORDER_TYPE_JAVA_CLASS_NAME,
  ORDER_TYPE_CUSTOM_V,
  ORDER_SET_CUSTOM_V,
  ORDER_FREQUENCY_CUSTOM_V,
  DRUGS_LIST_CUSTOM_V,
  CONCEPT_CUSTOM_V,
  REGIMEN_TO_SAVE_DESCRIPTION,
  RETURN_LOCATION,
  OPERATOR_ALL,
  FIELD_REQUIRED_ERROR_MESSAGE,
  UNIQUE_REGIMEN_NAME_ERROR_MESSAGE
} from '../../shared/constants/manage-regimens';
import { getSettings } from '../../redux/reducers/setttings';
import {
  setRegimens,
  setEditedRegimens,
  setRegimenToDelete,
  setDrugToDelete,
  setConfirmationModal
} from '../../redux/reducers/manage-regimens';
import { getOrderSet, deleteOrderSet, saveOrderSet, deleteOrderSetMember } from '../../redux/reducers/order-set';
import { getConcept } from '../../redux/reducers/concept';
import { getDrugsList } from '../../redux/reducers/drugs';
import { getFrequencies } from '../../redux/reducers/order-frequency';
import { getOrderType } from '../../redux/reducers/order-type';
import { cloneDeep, uniq, without } from 'lodash';
import '../Inputs.scss';
import './ManageRegimens.scss';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import { IDrugToDelete, IRegimenToDelete, IManageRegimensState, IRegimen } from '../../shared/models/manage-regimens';
import { IOrderSetState } from '../../shared/models/order-set';
import { IConceptState } from '../../shared/models/concept';
import { IDrugsState } from '../../shared/models/drugs';
import { IOrderFrequencyState } from '../../shared/models/order-frequency';
import { IOrderTypeState } from '../../shared/models/order-type';
import { EMPTY_STRING } from '../../shared/constants/input';

interface IStore {
  manageRegimens: IManageRegimensState;
  orderSet: IOrderSetState;
  concept: IConceptState;
  drugs: IDrugsState;
  orderFrequency: IOrderFrequencyState;
  orderType: IOrderTypeState;
  settings: {
    loading: boolean;
    settings: {
      property: string;
      value: string;
    }[];
  };
}

export interface IMangeRegimensProps extends StateProps, DispatchProps {
  intl: IntlShape;
}

export const ManageRegimens = ({
  intl: { formatMessage },
  isRegimensLoading,
  settingsLoading,
  orderSet,
  drugsList,
  drugDosingUnitsConcept,
  drugOrderType,
  success: { deletedOrderSet, deletedOrderSetMember, savedOrderSet },
  regimens,
  editedRegimens,
  regimenToDelete,
  drugToDelete,
  confirmationModal,
  getOrderSet,
  deleteOrderSet,
  saveOrderSet,
  deleteOrderSetMember,
  getSettings,
  getDrugsList,
  getFrequencies,
  getConcept,
  getOrderType,
  setRegimens,
  setEditedRegimens,
  setRegimenToDelete,
  setDrugToDelete,
  setConfirmationModal
}: IMangeRegimensProps) => {
  const [isAllSectionsExpanded, setIsAllSectionsExpanded] = useState(false);
  const onReturn = useCallback(() => (window.location.href = RETURN_LOCATION), []);
  const memoOrderSetList = useMemo(
    () =>
      orderSet.map(regimen => {
        const { display, orderSetMembers, uuid: regimenUuid } = regimen;
        const activeOrderSetMembers = orderSetMembers.filter(({ retired }) => !retired);
        const parseDrugs = activeOrderSetMembers.map(({ orderTemplate, uuid: drugUuid }) => {
          const parsedOrderSetMember = JSON.parse(orderTemplate);
          const { drug, doseUnits, dose, frequency } = parsedOrderSetMember;

          return {
            uuid: drugUuid,
            drugDetails: {
              label: drug.display,
              value: drug.uuid,
              abbreviation: drug.abbreviation,
              isValid: true
            },
            doseUnits: {
              label: doseUnits.display,
              value: doseUnits.uuid,
              isValid: true
            },
            dose,
            frequency: {
              label: frequency.display,
              value: frequency.uuid,
              isValid: true
            }
          };
        });

        return {
          regimenName: display,
          isValid: true,
          uuid: regimenUuid,
          drugs: parseDrugs
        };
      }),
    [orderSet]
  );

  useEffect(() => {
    getSettings(DRUG_DOSING_UNITS_SETTING_KEY);
    getOrderSet(ORDER_SET_CUSTOM_V);
    getOrderType(ORDER_TYPE_CUSTOM_V);
    getDrugsList(DRUGS_LIST_CUSTOM_V);
    getFrequencies(ORDER_FREQUENCY_CUSTOM_V);
  }, [getDrugsList, getFrequencies, getOrderSet, getOrderType, getSettings]);

  useEffect(() => {
    !settingsLoading && drugDosingUnitsConcept?.value && getConcept(drugDosingUnitsConcept.value, CONCEPT_CUSTOM_V);
  }, [settingsLoading, drugDosingUnitsConcept?.value, getConcept]);

  useEffect(() => {
    orderSet.length && setRegimens(memoOrderSetList);
  }, [orderSet, memoOrderSetList, setRegimens]);

  useEffect(() => {
    deletedOrderSet && successToast(formatMessage({ id: 'manageRegimens.regimenDeleted' }));
  }, [deletedOrderSet, formatMessage]);

  useEffect(() => {
    deletedOrderSetMember && successToast(formatMessage({ id: 'manageRegimens.drugDeleted' }));
  }, [deletedOrderSetMember, formatMessage]);

  useEffect(() => {
    savedOrderSet && onReturn();
  }, [savedOrderSet, onReturn]);

  const isRegimenNameUnique = useCallback(
    (regimenNameReceived, regimenIdxReceived, regimensReceived = regimens) =>
      regimensReceived.every(({ regimenName }, regimenIdx) =>
        regimenIdx !== regimenIdxReceived ? regimenName !== regimenNameReceived : true
      ),
    [regimens]
  );

  const onRemoveRegimenHandler = useCallback(
    ({ regimenUuid, regimenIdx }: IRegimenToDelete) => {
      const clonedRegimens = cloneDeep(regimens);
      clonedRegimens.splice(regimenIdx, 1);

      if (!clonedRegimens.length) {
        clonedRegimens.push(DEFAULT_MANAGE_REGIMEN_CONFIGURATION);
      }

      clonedRegimens.forEach(({ regimenName: clonedRegimenName }, clonedRegimenIdx) => {
        const otherRegimens = regimens.filter(({ uuid }, idx) => (regimenUuid ? uuid !== regimenUuid : idx !== regimenIdx));

        if (isRegimenNameUnique(clonedRegimenName, clonedRegimenIdx, otherRegimens)) {
          clonedRegimens[clonedRegimenIdx].isValid = true;
          clonedRegimens[clonedRegimenIdx].errorMessage = EMPTY_STRING;
        }
      });

      setRegimens(clonedRegimens);

      if (regimenUuid) {
        setEditedRegimens(without(editedRegimens, regimenUuid));
        deleteOrderSet(regimenUuid);
      }
    },
    [regimens, setRegimens, isRegimenNameUnique, setEditedRegimens, editedRegimens, deleteOrderSet]
  );

  const onRemoveDrugHandler = useCallback(
    ({ regimenUuid, regimenIdx, drugUuid, drugIdx }: IDrugToDelete) => {
      const clonedRegimens = cloneDeep(regimens);
      clonedRegimens[regimenIdx][DRUGS].splice(drugIdx, 1);
      regimenUuid && setEditedRegimens(uniq([...editedRegimens, regimenUuid]));

      if (!clonedRegimens[regimenIdx][DRUGS].length) {
        clonedRegimens[regimenIdx][DRUGS].push(DEFAULT_DRUG_CONFIGURATION);
      }

      setRegimens(clonedRegimens);
      drugUuid && deleteOrderSetMember(regimenUuid, drugUuid);
    },
    [regimens, setEditedRegimens, editedRegimens, setRegimens, deleteOrderSetMember]
  );

  const onAddRegimenHandler = useCallback(() => {
    const clonedRegimens = cloneDeep(regimens);
    clonedRegimens.push(DEFAULT_MANAGE_REGIMEN_CONFIGURATION);
    setRegimens(clonedRegimens);
  }, [regimens, setRegimens]);

  const validateEmptyFields = useCallback(() => {
    const clonedRegimens = cloneDeep(regimens);
    let isFormValid = true;

    clonedRegimens.forEach((regimen, regimenIdx) => {
      const { regimenName, drugs, isValid } = regimen;

      clonedRegimens[regimenIdx].errorMessage = EMPTY_STRING;
      clonedRegimens[regimenIdx].isValid = true;

      if (!regimenName || (!isValid && !isRegimenNameUnique(regimenName, regimenIdx))) {
        clonedRegimens[regimenIdx].isValid = false;
        isFormValid = false;
        clonedRegimens[regimenIdx].errorMessage = !regimenName ? FIELD_REQUIRED_ERROR_MESSAGE : UNIQUE_REGIMEN_NAME_ERROR_MESSAGE;
      }

      drugs.forEach((drug, drugIdx) => {
        const { doseUnits, drugDetails, frequency, dose } = drug;

        if (!Number(dose)) {
          isFormValid = false;
        }

        if (!doseUnits.value) {
          clonedRegimens[regimenIdx][DRUGS][drugIdx].doseUnits.isValid = false;
          isFormValid = false;
        }

        if (!drugDetails.value) {
          clonedRegimens[regimenIdx][DRUGS][drugIdx].drugDetails.isValid = false;
          isFormValid = false;
        }

        if (!frequency.value) {
          clonedRegimens[regimenIdx][DRUGS][drugIdx].frequency.isValid = false;
          isFormValid = false;
        }
      });
    });

    setRegimens(clonedRegimens);
    return isFormValid;
  }, [isRegimenNameUnique, regimens, setRegimens]);

  const onSave = useCallback(() => {
    const isFormValid = validateEmptyFields();

    if (!isFormValid) {
      return errorToast(formatMessage({ id: 'manageRegimens.regimensNotSaved' }));
    }

    const newRegimens = regimens.filter(({ uuid }) => !uuid);
    const regimensToSave = editedRegimens.map(editedRegimen => regimens.find(({ uuid }) => editedRegimen === uuid)).concat(newRegimens);

    const getDrugs = (regimen: IRegimen) =>
      regimen.drugs.map(drug => {
        const { drugDetails, doseUnits, dose, frequency } = drug;
        const foundConcept = drugsList.find(drugList => drugList.uuid === drug.drugDetails.value);
        const orderTemplate = {
          drug: {
            display: drugDetails.label,
            uuid: drugDetails.value,
            abbreviation: drugDetails.abbreviation
          },
          doseUnits: {
            display: doseUnits.label,
            uuid: doseUnits.value
          },
          dose,
          frequency: {
            display: frequency.label,
            uuid: frequency.value
          }
        };

        return {
          orderType: drugOrderType,
          orderTemplate: JSON.stringify(orderTemplate),
          orderTemplateType: DRUG_ORDER_TEMPLATE_TYPE,
          concept: foundConcept.concept.uuid
        };
      });

    const regimenToSave = (regimen: IRegimen) => ({
      operator: OPERATOR_ALL,
      name: regimen.regimenName,
      description: REGIMEN_TO_SAVE_DESCRIPTION,
      orderSetMembers: getDrugs(regimen)
    });

    regimensToSave.length && regimensToSave.forEach(regimen => saveOrderSet(regimenToSave(regimen), regimen?.uuid));
  }, [drugsList, editedRegimens, formatMessage, drugOrderType, regimens, saveOrderSet, validateEmptyFields]);

  const onNoHandler = useCallback(() => setConfirmationModal(CLOSED_MODAL_CONFIGURATION), [setConfirmationModal]);
  const onYesHandler = useCallback(() => {
    switch (confirmationModal.type) {
      case DELETE_REGIMEN_MODAL:
        onRemoveRegimenHandler(regimenToDelete);
        setRegimenToDelete(INITIAL_REGIMEN_VALUE);
        break;
      case DELETE_DRUG_MODAL:
        onRemoveDrugHandler(drugToDelete);
        setDrugToDelete(INITIAL_DRUG_VALUE);
        break;
    }
    setConfirmationModal(CLOSED_MODAL_CONFIGURATION);
  }, [
    confirmationModal.type,
    drugToDelete,
    regimenToDelete,
    onRemoveDrugHandler,
    onRemoveRegimenHandler,
    setConfirmationModal,
    setDrugToDelete,
    setRegimenToDelete
  ]);

  return (
    <div id="manage-regimens">
      <ConfirmationModal
        header={{ id: `manageRegimens.${confirmationModal.type}.header` }}
        body={{ id: `manageRegimens.${confirmationModal.type}.body` }}
        onYes={onYesHandler}
        onNo={onNoHandler}
        isOpen={confirmationModal.open}
      />
      <div className="title">
        <FormattedMessage id="manageRegimens.title" tagName="h2" />
        {!isRegimensLoading && (
          <Button
            onClick={() => setIsAllSectionsExpanded(!isAllSectionsExpanded)}
            className="cancel"
            data-testid="allSectionExpandedButton"
          >
            <FormattedMessage id={`notificationTemplates.button.${isAllSectionsExpanded ? 'collapse' : 'expand'}`} />
          </Button>
        )}
      </div>
      {isRegimensLoading ? (
        <div className="spinner" data-testid="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="section">
            {regimens.map((regimen, regimenIdx) => (
              <Regimen
                key={`${regimen.uuid}-${regimenIdx}`}
                regimen={regimen}
                regimenIdx={regimenIdx}
                isAllSectionsExpanded={isAllSectionsExpanded}
              />
            ))}
            <div className="d-flex justify-content-end mt-4 mb-2">
              <Button className="btn btn-primary" onClick={onAddRegimenHandler} data-testid="addNewRegimenButton">
                <FormattedMessage id="manageRegimens.addNewRegimen" />
              </Button>
            </div>
          </div>
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={onReturn} data-testid="returnButton">
                <FormattedMessage id="common.return" />
              </Button>
            </div>
            <div className="d-inline pull-right confirm-button-container">
              <Button className="save" onClick={onSave} data-testid="saveButton">
                <FormattedMessage id="common.save" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({
  manageRegimens: { regimens, editedRegimens, regimenToDelete, drugToDelete, confirmationModal },
  orderSet: { loading: orderSetLoading, orderSet, success },
  concept: {
    loading: { concept: conceptDoseTypesLoading }
  },
  drugs: { loading: drugsLoading, drugsList },
  orderFrequency: { loading: frequencyLoading },
  orderType: { loading: orderTypeLoading, orderTypes },
  settings: { settings = [], loading: settingsLoading }
}: IStore) => {
  const isRegimensLoading = [
    orderSetLoading,
    conceptDoseTypesLoading,
    drugsLoading,
    frequencyLoading,
    orderTypeLoading,
    settingsLoading
  ].some(value => value);
  return {
    isRegimensLoading,
    drugDosingUnitsConcept: settings.find(({ property }) => property === DRUG_DOSING_UNITS_SETTING_KEY),
    settingsLoading,
    orderSet,
    drugsList,
    success,
    drugOrderType: orderTypes.find(({ javaClassName = EMPTY_STRING }) => javaClassName === DRUG_ORDER_TYPE_JAVA_CLASS_NAME),
    regimens,
    editedRegimens,
    regimenToDelete,
    drugToDelete,
    confirmationModal
  };
};

const mapDispatchToProps = {
  getOrderSet,
  deleteOrderSet,
  saveOrderSet,
  deleteOrderSetMember,
  getDrugsList,
  getFrequencies,
  getConcept,
  getSettings,
  getOrderType,
  setRegimens,
  setEditedRegimens,
  setRegimenToDelete,
  setDrugToDelete,
  setConfirmationModal
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageRegimens));
