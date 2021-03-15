import { PATIENT_IDENTIFIER } from "../constants/patient";
import { extractValue } from "./omrs-entity-util";
import { columnContent as personColumnContent } from "./person-util";

export const columnContent = (patient, column) => {
  // extract the value from person first
  const content = patient.person && personColumnContent(patient.person, column);
  if (!!content) {
    return content;
  } else {
    // extract the value from patient otherwise
    switch (column) {
      case PATIENT_IDENTIFIER:
        return patient.identifiers && patient.identifiers[0].identifier;
      default:
        return extractValue(patient[column]);
    }
  }
};
