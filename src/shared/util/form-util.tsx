export const getPlaceholder = (intl, label, fieldName, required) => {
  let placeholder =
    label ||
    intl.formatMessage({
      id: 'registerPatient.fields.' + fieldName
    }) ||
    fieldName;
  if (required) {
    placeholder = [
      placeholder,
      intl.formatMessage({
        id: 'registerPatient.fields.required'
      })
    ].join(' ');
  }
  return placeholder;
};
