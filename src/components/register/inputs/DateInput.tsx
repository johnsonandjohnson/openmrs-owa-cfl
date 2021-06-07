import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DatePicker from 'react-datepicker';
import { IFieldProps, IFieldState } from './Field';
import ValidationError from './ValidationError';
import { getCommonInputProps, getPlaceholder } from '../../../shared/util/patient-form-util';
import { DATE_FORMAT } from '../../../shared/util/date-util';

export interface IDateInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

class DateInput extends React.Component<IDateInputProps, IFieldState> {
  render = () => {
    const { intl, field, isInvalid, isDirty, className, value, patient } = this.props;
    const { name, required, label } = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = {
      ...getCommonInputProps(this.props, placeholder),
      placeholderText: placeholder,
      selected: value != null ? value : patient[name]
    };
    return (
      <div className={`${className} input-container`}>
        <DatePicker {...props} peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" dateFormat={DATE_FORMAT} />
        {hasValue && <span className="placeholder">{placeholder}</span>}
        {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field} />}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DateInput));
