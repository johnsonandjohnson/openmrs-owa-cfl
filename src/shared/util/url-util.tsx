import queryString from 'query-string';
import { ROOT_URL } from '../constants/openmrs';

export const redirectUrl = search => {
  const params = queryString.parse(search);
  const { redirect, dashboard = '' } = params;
  const redirectUrl = dashboard ? `${redirect}&dashboard=${dashboard}` : `${redirect}`;

  return (redirectUrl || ROOT_URL).toString();
};

export const nameParamVal = search => {
  const params = queryString.parse(search);
  return params['name'] && params['name'].toString();
};
