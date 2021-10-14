export interface ILocation {
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  tags: Array<string>;
  attributes: Array<ILocationAttributeTypeValue>;
}

export interface ILocationAttributeType {
  datatypeClassname: string;
  datatypeConfig: string;
  description: string;
  display: string;
  handlerConfig: string;
  maxOccurs: number;
  minOccurs: number;
  name: string;
  preferredHandlerClassname: string;
  retired: boolean;
  uuid: string;
}

export interface ILocationAttributeTypeValue {
  attributeType: string;
  value: string;
}
