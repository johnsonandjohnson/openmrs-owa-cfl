import Condition from '../../components/conditions/Condition';
import FindPatient from '../../components/find-patient/FindPatient';
import { PRIVILEGES } from './privilege';
import FindCaregiver from '../../components/find-caregiver/FindCaregiver';
import RegisterPatient from '../../components/register/RegisterPatient';
import RegisterCaregiver from '../../components/register/RegisterCaregiver';
import Dashboard from '../../components/dashboard/Dashboard';
import Conditions from '../../components/conditions/Conditions';
import VmpConfig from '../../components/vmp-config/VmpConfig';

export const routeConfig = [
  {
    path: '/conditions/:patientUuid/manage',
    component: Condition,
    breadcrumb: 'manageCondition.title'
  },
  {
    path: '/conditions/:patientUuid',
    component: Conditions,
    breadcrumb: 'conditions.title'
  },
  {
    path: '/vmp-config',
    component: VmpConfig,
    breadcrumb: 'vmpConfig.title'
  },
  {
    path: '/find-patient',
    component: FindPatient,
    breadcrumb: 'findPatient.title',
    requiredPrivilege: PRIVILEGES.GET_PATIENTS
  },
  {
    path: '/find-caregiver',
    component: FindCaregiver,
    breadcrumb: 'findCaregiver.title',
    requiredPrivilege: PRIVILEGES.GET_PEOPLE
  },
  {
    path: '/register-patient',
    component: RegisterPatient,
    breadcrumb: 'registerPatient.title',
    requiredPrivilege: PRIVILEGES.ADD_PATIENTS
  },
  {
    path: '/edit-patient/:id',
    component: RegisterPatient,
    breadcrumb: 'editPatient.title',
    requiredPrivilege: PRIVILEGES.EDIT_PATIENTS
  },
  {
    path: '/register-caregiver',
    component: RegisterCaregiver,
    breadcrumb: 'registerCaregiver.title',
    requiredPrivilege: PRIVILEGES.ADD_PATIENTS
  },
  {
    path: '/edit-caregiver/:id',
    component: RegisterCaregiver,
    breadcrumb: 'editCaregiver.title',
    requiredPrivilege: PRIVILEGES.EDIT_PATIENTS
  },
  {
    path: '/',
    component: Dashboard,
    breadcrumb: 'home.title'
  }
];
