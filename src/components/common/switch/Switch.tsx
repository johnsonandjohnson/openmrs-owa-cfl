import React from 'react';
import { default as ReactSwitch } from 'rc-switch';
import { FormattedMessage } from 'react-intl';
import './Switch.scss';
import 'rc-switch/assets/index.css';

export default function Switch({
  intl,
  onChange,
  checkedTranslationId,
  uncheckedTranslationId,
  labelTranslationId,
  checked = false,
  disabled = false
}) {
  return (
    <div className="inline-fields switch-with-label">
      <label htmlFor="switch">
        <FormattedMessage id={labelTranslationId} />
      </label>
      <ReactSwitch
        id="switch"
        onChange={onChange}
        onClick={onChange}
        disabled={disabled}
        checked={checked}
        checkedChildren={intl.formatMessage({ id: checkedTranslationId })}
        unCheckedChildren={intl.formatMessage({ id: uncheckedTranslationId })}
      />
    </div>
  );
}
