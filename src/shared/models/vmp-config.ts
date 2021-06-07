export interface IVmpConfig {
  syncScope: string;
  operatorCredentialsRetentionTime: number;
  operatorOfflineSessionTimeout: number;
  manufacturers: any[];
  vaccine: any[];
  canUseDifferentManufacturers: boolean;
  personLanguages: any[];
  authSteps: any[];
  irisScore: number;
  addressFields: any[];
  allowManualParticipantIDEntry: boolean;
  participantIDRegex: string;
}
