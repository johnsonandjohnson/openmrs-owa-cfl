import { combineReducers } from 'redux';
import cflPatient from './patient';
import cflPerson from './person';
import cflPeople from './cfl-people';
import session from './session';
import settings from './setttings';
import location from './location';
import relationshipType from './relationship-type';
import registration from './registration';
import { reducers as openmrsReducers } from '@openmrs/react-components';
import { reducer as reduxFormReducer } from 'redux-form';
import customizeReducer from '@bit/soldevelo-cfl.omrs-components.customize/customize.reducer';
import person from '@bit/soldevelo-omrs.cfl-components.person-header/person-header/person.reducer';
import patient from '@bit/soldevelo-omrs.cfl-components.person-header/person-header/patient.reducer';
import personStatus from '@bit/soldevelo-cfl.omrs-components.person-status/person-status/person-status.reducer';
import apps from './apps';
import concept from './concept';
import condition from './condition';
import breadcrumbs from './breadcrumbs';
import visit from './visit';
import addressData from './address-data';
import provider from './provider';
import messages from './messages';
import role from './role';
import user from './user';
import manageRegimens from './manage-regimens';
import orderSet from './order-set';
import drugs from './drugs';
import orderFrequency from './order-frequency';
import orderType from './order-type';
import findPatientRecordColumns from './columns-configuration';

export default combineReducers({
  cflPatient,
  cflPerson,
  cflPeople,
  session,
  settings,
  location,
  relationshipType,
  registration,
  apps,
  concept,
  condition,
  breadcrumbs,
  person,
  patient,
  personStatus,
  role,
  user,
  customizeReducer,
  visit,
  addressData,
  provider,
  messages,
  manageRegimens,
  orderSet,
  drugs,
  orderFrequency,
  orderType,
  findPatientRecordColumns,
  openmrs: openmrsReducers,
  form: reduxFormReducer
});
