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
  customizeReducer,
  visit,
  openmrs: openmrsReducers,
  form: reduxFormReducer
});
