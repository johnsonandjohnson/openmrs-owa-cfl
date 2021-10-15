import React from 'react';
import { Input } from 'reactstrap';
import Select from 'react-select';
import SortableMultiSelect from './SortableSelect';
import TextareaAutosize from 'react-textarea-autosize';
import RadioButtons from '../radio-buttons/radio-buttons';

interface IWithPlaceholderProps {
  placeholder: string;
  showPlaceholder: boolean;
  wrapperClassName?: string;
  // input props
  value?: any;
  onChange?: any;
  options?: any[];
  isMulti?: boolean;
  isOptionSelected?: any;
  classNamePrefix?: string;
  theme?: any;
  [propName: string]: any;
}

export const withPlaceholder = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  class extends React.Component<P & IWithPlaceholderProps> {
    render() {
      return (
        <div className={`input-container ${this.props.wrapperClassName || ''}`}>
          <WrappedComponent
            {...this.props}
            placeholder={this.props.placeholder || ''}
            styles={{
              menu: provided => ({ ...provided, zIndex: 9999 })
            }}
          />
          {!!this.props.showPlaceholder && <span className="placeholder">{this.props.placeholder || ''}</span>}
        </div>
      );
    }
  };

export const InputWithPlaceholder = withPlaceholder(Input);
export const SelectWithPlaceholder = withPlaceholder(Select);
export const SortableSelectWithPlaceholder = withPlaceholder(SortableMultiSelect);
export const TextareaAutosizeWithPlaceholder = withPlaceholder(TextareaAutosize);
export const RadioButtonsWithPlaceholder = withPlaceholder(RadioButtons);
