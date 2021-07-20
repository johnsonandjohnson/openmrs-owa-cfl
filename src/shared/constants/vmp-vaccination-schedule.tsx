import { ZERO } from './input';

export const VMP_VACCINATION_SCHEDULE_SETTING_KEY = 'cfl.vaccines';
export const DEFAULT_DOSING_VISIT_TYPES = ['Dosing'];
export const EMPTY_VISIT = {
  doseNumber: ZERO,
  nameOfDose: '',
  numberOfFutureVisit: ZERO,
  lowWindow: ZERO,
  midPointWindow: ZERO,
  upWindow: ZERO
};
export const EMPTY_REGIMEN = { name: null };
export const DEFAULT_VMP_VACCINATION_SCHEDULE = [EMPTY_REGIMEN];
