import { DEFAULT_COLUMN_VALUE, DISPLAY } from "../constants/patient";

export const extractValue = (prop) => {
  if (!prop) {
    return DEFAULT_COLUMN_VALUE;
  } else if (Array.isArray(prop)) {
    return prop[0][DISPLAY] || DEFAULT_COLUMN_VALUE;
  } else if (typeof prop === "object") {
    return prop[DISPLAY] || DEFAULT_COLUMN_VALUE;
  } else {
    return prop;
  }
};

export const extractAttribute = (entity, type) => {
  if (!entity) {
    return DEFAULT_COLUMN_VALUE;
  }
  const attr =
    entity.attributes &&
    entity.attributes.find(
      (attr) => attr.attributeType[DISPLAY].toLowerCase() === type.toLowerCase()
    );
  return (attr && attr.value) || DEFAULT_COLUMN_VALUE;
};
