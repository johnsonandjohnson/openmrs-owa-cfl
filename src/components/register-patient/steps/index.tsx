import Name from "./Name";
import Gender from "./Gender";
import Birthdate from "./Birthdate";
import Address from "./Address";
import Language from "./Language";
import PhoneNumber from "./PhoneNumber";
import PatientLocation from "./PatientLocation";
import AadharNumber from "./AadharNumber";
import ArtNumber from "./ArtNumber";
import Relatives from "./Relatives";
import Confirm from "./Confirm";

export const steps = {
  name: Name,
  gender: Gender,
  birthdate: Birthdate,
  address: Address,
  language: Language,
  phoneNumber: PhoneNumber,
  patientLocation: PatientLocation,
  aadharNumber: AadharNumber,
  artNumber: ArtNumber,
  relatives: Relatives,
  confirm: Confirm,
};

export const getStepCount = () => Object.getOwnPropertyNames(steps).length;
