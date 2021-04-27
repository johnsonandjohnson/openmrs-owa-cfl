import { DEFAULT_COLUMN_VALUE, DISPLAY } from '../constants/patient';

export const extractValue = prop => {
  if (!prop) {
    return DEFAULT_COLUMN_VALUE;
  } else if (Array.isArray(prop)) {
    return prop[0][DISPLAY] || DEFAULT_COLUMN_VALUE;
  } else if (typeof prop === 'object') {
    return prop[DISPLAY] || DEFAULT_COLUMN_VALUE;
  } else {
    return prop;
  }
};

export const extractAttribute = (entity, type) => {
  if (!entity) {
    return DEFAULT_COLUMN_VALUE;
  }
  const attr = entity.attributes && entity.attributes.find(a => a.attributeType[DISPLAY].toLowerCase() === type.toLowerCase());
  return (attr && attr.value) || DEFAULT_COLUMN_VALUE;
};

export const extractAttributes = entity => {
  const attributes = {};
  entity &&
    entity.attributes &&
    entity.attributes.forEach(attr => (attributes[attr.attributeType[DISPLAY]] = attr.value || DEFAULT_COLUMN_VALUE));
  return attributes;
};

export const extractIdentifier = (entity, type) => {
  if (!entity) {
    return DEFAULT_COLUMN_VALUE;
  }
  const identifier = entity.identifiers && entity.identifiers.find(id => id.identifierType[DISPLAY].toLowerCase() === type.toLowerCase());
  return (identifier && identifier.identifier) || DEFAULT_COLUMN_VALUE;
};

export const extractIdentifiers = entity => {
  const identifiers = {};
  entity &&
    entity.identifiers &&
    entity.identifiers.forEach(id => (identifiers[id.identifierType[DISPLAY]] = id.identifier || DEFAULT_COLUMN_VALUE));
  return identifiers;
};
