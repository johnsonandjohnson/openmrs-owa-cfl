import React, { useEffect } from 'react';
import ValidationError from './ValidationError';
import cx from 'classnames';
import { connect } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { Input as ReactstrapInput } from 'reactstrap';
import { IFieldProps } from './Field';
import { getConcept } from '../../../redux/reducers/concept';
import { getSettingByQuery } from '../../../redux/reducers/setttings';
import { getCommonInputProps, getPlaceholder } from '../../../shared/util/patient-form-util';
import { IConceptState } from '../../../shared/models/concept';
import { CONCEPT_CUSTOM_V } from '../../../shared/constants/manage-regimens';

export interface ISelectProps extends StateProps, DispatchProps, IFieldProps {
  intl: IntlShape;
}

interface IStore {
  concept: IConceptState;
  settings: { setting: { value: string } };
}

export const Select = (props: ISelectProps) => {
  const GLOBAL_PROPERTY = 'globalProperty';
  const CONCEPT = 'concept';
  const {
    field,
    isInvalid,
    isDirty,
    className,
    value,
    patient,
    intl,
    selectOptions,
    concept,
    onPatientChange,
    settings,
    getConcept,
    getSettingByQuery
  } = props;
  const { name, required, label, options, defaultOption = '', optionSource = '', optionUuid = '', optionKey = '' } = field;
  const hasValue = value || patient[name] || defaultOption;
  const placeholder = getPlaceholder(intl, label, name, required);
  const commonProps = getCommonInputProps(props, placeholder);
  const dataTestId = props['data-testid'] || name;
  const isConceptOptionSource = optionSource === CONCEPT;
  const isGlobalPropertyOptionSource = optionSource === GLOBAL_PROPERTY;

  useEffect(() => {
    if (isConceptOptionSource) {
      getConcept(optionUuid, CONCEPT_CUSTOM_V);
    } else if (isGlobalPropertyOptionSource) {
      getSettingByQuery(optionUuid);
    }
  }, [getConcept, getSettingByQuery, isConceptOptionSource, isGlobalPropertyOptionSource, optionSource, optionUuid]);

  useEffect(() => {
    if (!patient[name] && defaultOption) {
      onPatientChange({ ...patient, [name]: defaultOption });
    }
  }, [defaultOption, name, onPatientChange, patient]);

  const getSelectOptions = () => {
    let opts = selectOptions || options;

    if (isGlobalPropertyOptionSource && settings?.setting?.value) {
      const configParsed = JSON.parse(settings.setting.value);
      opts = configParsed[optionKey].map(({ name }) => name);
    } else if (isConceptOptionSource && concept?.concept?.setMembers.length) {
      opts = concept.concept.setMembers.map(({ display }) => display).sort();
    }

    if (opts) {
      return (
        <>
          {
            <option value="" disabled hidden>
              {placeholder}
            </option>
          }
          {opts.map(option => (
            <option value={option.value || option} key={`option-${option.value || option}`}>
              {option.label || option}
            </option>
          ))}
        </>
      );
    }
  };

  return (
    <div className={`${className} input-container`}>
      <ReactstrapInput
        {...commonProps}
        className={cx('form-control', {
          invalid: isDirty && isInvalid,
          placeholder: !hasValue
        })}
        type="select"
        data-testid={dataTestId}
        defaultValue={defaultOption}
      >
        {getSelectOptions()}
      </ReactstrapInput>
      {hasValue && <span className="placeholder">{placeholder}</span>}
      {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field} />}
    </div>
  );
};

const mapStateToProps = ({ concept, settings }: IStore) => ({ concept, settings });

const mapDispatchToProps = { getConcept, getSettingByQuery };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Select));
