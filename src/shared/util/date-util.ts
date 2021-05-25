export const dobToAge = dob => {
  if (!dob) return dob;
  const birthDate = new Date(dob);
  const difference = Date.now() - birthDate.getTime();
  const age = new Date(difference);

  return Math.abs(age.getUTCFullYear() - 1970);
};

export const DATE_FORMAT = 'dd MMM yyyy';

export const formatDate = (intl, date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);

export const isoDateString = jsDate => (jsDate ? jsDate.toISOString().split('T')[0] : null);
