export const dobToAge = (dob) => {
  if (!dob) return dob;
  const birthDate = new Date(dob);
  const difference = Date.now() - birthDate.getTime();
  const age = new Date(difference);

  return Math.abs(age.getUTCFullYear() - 1970);
};

export const formatDate = (intl, date) => {
  return intl.formatDate(date, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};
