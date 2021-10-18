import Condition from '../../components/conditions/Condition';
import FindPatient from '../../components/find-patient/FindPatient';
import { PRIVILEGES } from './privilege';
import FindCaregiver from '../../components/find-caregiver/FindCaregiver';
import RegisterPatient from '../../components/register/RegisterPatient';
import RegisterCaregiver from '../../components/register/RegisterCaregiver';
import Dashboard from '../../components/dashboard/Dashboard';
import Conditions from '../../components/conditions/Conditions';
import VmpConfig from '../../components/vmp-config/VmpConfig';
import VmpVaccinationSchedule from '../../components/vmp-vaccination-schedule/VmpVaccinationSchedule';
import VmpAddressData from '../../components/vmp-address-data/VmpAddressData';
import VmpTranslations from '../../components/vmp-translations/VmpTranslations';
import NotificationConfiguration from '../../components/notification-configuration/NotificationConfiguration';
import NotificationTemplates from '../../components/notification-templates/NotificationTemplates';
import Location from '../../components/locations/Location';

export const routeConfig = [
  {
    path: '/locations/location',
    component: Location,
    breadcrumb: 'locations.location.title'
  },
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
    path: '/vmp-vaccination-schedule',
    component: VmpVaccinationSchedule,
    breadcrumb: 'vmpVaccinationSchedule.title'
  },
  {
    path: '/vmp-address-data',
    component: VmpAddressData,
    breadcrumb: 'vmpAddressData.title'
  },
  {
    path: '/vmp-translations',
    component: VmpTranslations,
    breadcrumb: 'vmpTranslations.title'
  },
  {
    path: '/notification-configuration',
    component: NotificationConfiguration,
    breadcrumb: 'notificationConfiguration.title'
  },
  {
    path: '/notification-templates',
    component: NotificationTemplates,
    breadcrumb: 'notificationTemplates.title'
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
