import { combineReducers } from 'redux';
import patient from './patient';
import person from './person';
import cflPeople from './cfl-people';
import session from './session';
import settings from './setttings';
import location from './location';
import relationshipType from './relationship-type';
import registration from './registration';
import { reducers as openmrsReducers } from '@openmrs/react-components';
import { reducer as reduxFormReducer } from 'redux-form';
import customizeReducer from '@bit/soldevelo-cfl.omrs-components.customize/customize.reducer';
import apps from './apps';

export default combineReducers({
  patient,
  person,
  cflPeople,
  session,
  settings,
  location,
  relationshipType,
  registration,
  apps,
  customizeReducer,
  openmrs: openmrsReducers,
  form: reduxFormReducer
});
