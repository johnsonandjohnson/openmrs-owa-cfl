/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { ChangeEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Location.scss";
import { FormattedMessage, injectIntl, IntlShape } from "react-intl";
import "../Inputs.scss";
import { Button, Spinner } from "reactstrap";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ROOT_URL } from "../../shared/constants/openmrs";
import {
  InputWithPlaceholder,
  RadioButtonsWithPlaceholder,
  SelectWithPlaceholder,
} from "../common/form/withPlaceholder";
import { extractEventValue, selectDefaultTheme } from "../../shared/util/form-util";
import { getLocationAttributeTypes, searchLocations, saveLocation, getLocation } from "../../redux/reducers/location";
import { chunk, cloneDeep, uniq } from "lodash";
import { ILocation, ILocationAttributeType, ILocationListItem } from "../../shared/models/location";
import { EMPTY_STRING, STRING_FALSE, STRING_TRUE } from "../../shared/constants/input";
import { TextareaWithPlaceholder } from "../common/textarea/Textarea";
import ValidationError from "../common/form/ValidationError";
import { scrollToTop } from "../../shared/util/window-util";
import cx from "classnames";
import { getSettingByQuery } from "../../redux/reducers/settings";
import { getConcept } from "../../redux/reducers/concept";
import {
  BOOLEAN_RADIOS_PREFERRED_HANDLER,
  COLUMNS,
  DEFAULT_LOCATION,
  DROPDOWN_HANDLER_CONFIG_SEPARATOR,
  DROPDOWN_PREFERRED_HANDLER,
  LOCATION_DEFAULT_TAG_LIST_SETTING_KEY,
  TEXTAREA_PREFERRED_HANDLER,
  REQUIRED_OCCURRENCE,
  COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID,
  CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID,
  PROJECT_LOCATION_ATTRIBUTE_TYPE_UUID,
  MANDATORY_LOCATION_ATTRIBUTE_TYPE_UUID,
} from "../../shared/constants/location";
import { COUNTRY_CONCEPT_UUID, COUNTRY_CONCEPT_REPRESENTATION } from "../../shared/constants/concept";
import { IConceptSetMember } from "../../shared/models/concept";
import { getProjectNames } from "src/redux/reducers/project";

export interface ILocationProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: IntlShape;
}

interface IStore {
  location: {
    loadingLocations: boolean;
    locations: Array<ILocationListItem>;
    errorMessage: string;
    locationAttributeTypes: Array<ILocationAttributeType>;
    loadingLocationAttributeTypes: boolean;
    success: boolean;
    loadingLocation: boolean;
    location: ILocation;
  };
  settings: {
    loading: boolean;
    setting: { value: string } | null;
  };
  concept: {
    concept: {
      setMembers: Array<IConceptSetMember>;
    };
    loading: {
      concept: boolean;
    };
  };
  project: {
    projects: any[];
  };
}

interface IUrlParams {
  locationId: string;
}

interface IOption {
  label: string;
  value: string;
}

export const Location = ({
  editedLocation,
  countryClusters,
  countryNames,
  countryOptions,
  intl: { formatMessage },
  isLocationLoading,
  locations,
  locationAttributeTypes,
  match,
  settingValue,
  success,
  projects,
  getConcept,
  getLocation,
  getLocationAttributeTypes,
  getSettingByQuery,
  saveLocation,
  searchLocations,
  getProjectNames,
}: ILocationProps) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const { locationId } = match.params as IUrlParams;

  useEffect(() => {
    getLocationAttributeTypes();
    searchLocations();
    getSettingByQuery(LOCATION_DEFAULT_TAG_LIST_SETTING_KEY);
    getProjectNames();
    getConcept(COUNTRY_CONCEPT_UUID, COUNTRY_CONCEPT_REPRESENTATION);
    if (locationId) {
      getLocation(locationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editedLocation) {
      setLocation(editedLocation);
    }
  }, [editedLocation]);

  const onReturn = () => {
    window.location.href = `${ROOT_URL}adminui/metadata/locations/manageLocations.page`;
  };

  const onSave = () => {
    const requiredLocationAttributeTypes = locationAttributeTypes.filter(
      (locationAttributeType) => locationAttributeType.minOccurs === REQUIRED_OCCURRENCE,
    );
    const isAllRequiredLocationAttributeTypesFilled = requiredLocationAttributeTypes.every(
      ({ uuid: requiredLocationAttributeTypeUuid }) =>
        location.attributes.find(
          ({ attributeType, value }) => requiredLocationAttributeTypeUuid === attributeType.uuid && value,
        ),
    );

    if (
      isLocationNameEmpty ||
      isLocationNameDuplicated ||
      isCountryEmpty ||
      !isAllRequiredLocationAttributeTypesFilled
    ) {
      setShowValidationErrors(true);
      scrollToTop();
    } else {
      const preparedLocation = cloneDeep(location) as ILocation;
      const locationDefaultTags = settingValue ? JSON.parse(settingValue) : [];

      preparedLocation.attributes = preparedLocation.attributes
        .filter((attribute) => attribute.value !== "")
        .map(({ attributeType, value }) => ({ attributeType, value }));
      preparedLocation.tags = uniq([...preparedLocation.tags, ...locationDefaultTags]);

      saveLocation(preparedLocation);
    }
  };

  useEffect(() => {
    if (success) {
      onReturn();
    }
  }, [success]);

  const onValueChange = (name: string) => (event: ChangeEvent) =>
    setLocation({ ...location, [name]: extractEventValue(event) });

  const onCountryValueChange = (event: ChangeEvent) => {
    let attributes = location.attributes;
    const countryFullySpecifiedName: IOption = extractEventValue(event);
    const countryShortName = countryNames.find(
      ({ fullySpecified }) => fullySpecified === countryFullySpecifiedName.value,
    )?.short;

    if (locationAttributeTypes.some(({ uuid }) => uuid === COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID)) {
      const countryCodeAttribute = attributes.find(
        ({ attributeType }) => attributeType.uuid === COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID,
      );

      // fill in Country Code based on the selected Country
      if (countryCodeAttribute) {
        countryCodeAttribute.value = countryShortName;
      } else {
        attributes = [
          ...location.attributes,
          { attributeType: { uuid: COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID }, value: countryShortName },
        ];
      }
    }

    if (locationAttributeTypes.some(({ uuid }) => uuid === CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID)) {
      const clusterAttribute = attributes.find(
        ({ attributeType }) => attributeType.uuid === CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID,
      );

      // clear Cluster value on Country change
      if (clusterAttribute) {
        clusterAttribute.value = null;
      }
    }

    setLocation({ ...location, country: countryFullySpecifiedName.value, attributes });
  };

  const onAttributeValueChange = (uuid: string) => (event: ChangeEvent | string) => {
    let attributes = location.attributes;
    const attribute = attributes.find((attributeToCheck) => attributeToCheck.attributeType.uuid === uuid);
    const value = extractEventValue(event);

    if (attribute) {
      attribute.value = value;
    } else {
      attributes = [...location.attributes, { attributeType: { uuid }, value }];
    }

    setLocation({ ...location, attributes });
  };

  const isLocationNameEmpty = !location.name;

  const isLocationNameDuplicated = locations
    .filter((loc) => loc.uuid !== location.uuid)
    .map((loc) => loc.display.toLowerCase())
    .includes(location.name.toLowerCase());

  const isCountryEmpty = !location.country;

  const locationAttributeTypesGrouped: Array<Array<ILocationAttributeType>> = chunk(locationAttributeTypes, COLUMNS);

  const input = (locationAttributeType: ILocationAttributeType) => {
    const {
      uuid: locationAttributeTypeUuid,
      name: placeholder,
      minOccurs,
      preferredHandlerClassname,
      handlerConfig,
    } = locationAttributeType;
    const key = `locationAttribute${locationAttributeTypeUuid}`;
    const value = location.attributes.find((attribute) => locationAttributeTypeUuid === attribute.attributeType.uuid)
      ?.value;
    const isRequired =
      minOccurs === REQUIRED_OCCURRENCE || MANDATORY_LOCATION_ATTRIBUTE_TYPE_UUID.includes(locationAttributeTypeUuid);
    const isInvalid = isRequired && !value;
    const onChange = onAttributeValueChange(locationAttributeTypeUuid);

    if (locationAttributeTypeUuid === CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID) {
      const options: Array<IOption> =
        countryClusters
          .find(({ countryName }) => countryName === location.country)
          ?.clusters?.map((clusterName) => ({ label: clusterName, value: clusterName })) ?? [];
      return (
        <div className="input-container" key={key}>
          <SelectWithPlaceholder
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={value && options.find((option) => option.value === value)}
            onChange={(option: IOption) => onChange(option.value)}
            options={options}
            wrapperClassName={cx("flex-1", { invalid: showValidationErrors && isInvalid })}
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
            isDisabled={isCountryEmpty}
          />
          {showValidationErrors && isInvalid && <ValidationError message="common.error.required" />}
        </div>
      );
    } else if (locationAttributeTypeUuid === PROJECT_LOCATION_ATTRIBUTE_TYPE_UUID) {
      const options: Array<IOption> = projects.map(({ display, uuid }) => ({ label: display, value: uuid }));
      const projectUuid = value ? value["uuid"] : "";
      return (
        <div className="input-container" key={key}>
          <SelectWithPlaceholder
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={value && options.find((option) => option.value === projectUuid)}
            onChange={(option: IOption | null) => onChange(option?.value || "")}
            options={options}
            wrapperClassName={cx("flex-1", { invalid: showValidationErrors && isInvalid })}
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
            isClearable
          />
          {showValidationErrors && isInvalid && <ValidationError message="common.error.required" />}
        </div>
      );
    } else if (locationAttributeTypeUuid === COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID) {
      return (
        <div className="input-container" key={key}>
          <InputWithPlaceholder
            className={cx({ invalid: showValidationErrors && isInvalid })}
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={value || EMPTY_STRING}
            onChange={onChange}
            readOnly
          />
          {showValidationErrors && isInvalid && <ValidationError message="common.error.required" />}
        </div>
      );
    } else
      switch (preferredHandlerClassname) {
        case DROPDOWN_PREFERRED_HANDLER:
          const options: Array<IOption> = handlerConfig
            .split(DROPDOWN_HANDLER_CONFIG_SEPARATOR)
            .map((dropdownValue) => ({ label: dropdownValue, value: dropdownValue }));
          return (
            <div className="input-container" key={key}>
              <SelectWithPlaceholder
                placeholder={placeholder}
                showPlaceholder={!!value}
                value={options.find((option) => option.value === value)}
                onChange={(option: IOption) => onChange(option.value)}
                options={options}
                wrapperClassName={cx("flex-1", { invalid: showValidationErrors && isInvalid })}
                classNamePrefix="default-select"
                theme={selectDefaultTheme}
              />
              {showValidationErrors && isInvalid && <ValidationError message="common.error.required" />}
            </div>
          );
        case BOOLEAN_RADIOS_PREFERRED_HANDLER:
          return (
            <RadioButtonsWithPlaceholder
              key={key}
              name={key}
              onChange={onChange}
              options={[
                { value: STRING_TRUE, label: formatMessage({ id: "common.true" }) },
                { value: STRING_FALSE, label: formatMessage({ id: "common.false" }) },
              ]}
              value={value?.toString()}
              placeholder={placeholder}
              showPlaceholder
            />
          );
        case TEXTAREA_PREFERRED_HANDLER:
          return (
            <div className="input-container" key={key}>
              <TextareaWithPlaceholder
                className={cx(showValidationErrors && isInvalid)}
                placeholder={placeholder}
                showPlaceholder={!!value}
                value={value || EMPTY_STRING}
                onChange={onChange}
                isResizable
              />
              {showValidationErrors && isInvalid && <ValidationError message="common.error.required" />}
            </div>
          );
        default:
          return (
            <div className="input-container" key={key}>
              <InputWithPlaceholder
                className={cx({ invalid: showValidationErrors && isInvalid })}
                placeholder={placeholder}
                showPlaceholder={!!value}
                value={value || EMPTY_STRING}
                onChange={onChange}
              />
              {showValidationErrors && isInvalid && <ValidationError message="common.error.required" />}
            </div>
          );
      }
  };

  return (
    <div id="location">
      <h2>
        <FormattedMessage id={`locations.location.${locationId ? "edit" : "create"}.title`} />
      </h2>
      <div className="inner-content">
        {isLocationLoading ? (
          <div className="spinner">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="section">
              <div className="inline-fields">
                <div className="input-container">
                  <InputWithPlaceholder
                    key="locationNameInput"
                    placeholder={formatMessage({ id: "locations.location.name" })}
                    showPlaceholder={!!location.name}
                    value={location.name || EMPTY_STRING}
                    onChange={onValueChange("name")}
                    className={cx({
                      invalid: showValidationErrors && (isLocationNameEmpty || isLocationNameDuplicated),
                    })}
                    data-testid="locationNameInput"
                  />
                  {showValidationErrors &&
                    (isLocationNameEmpty ? (
                      <ValidationError message="common.error.required" />
                    ) : (
                      isLocationNameDuplicated && <ValidationError message="common.error.nameUnique" />
                    ))}
                </div>
                <InputWithPlaceholder
                  key="locationDescriptionInput"
                  placeholder={formatMessage({ id: "locations.location.description" })}
                  showPlaceholder={!!location.description}
                  value={location.description || EMPTY_STRING}
                  onChange={onValueChange("description")}
                  data-testid="locationDescriptionInput"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationAddress1Input"
                  placeholder={formatMessage({ id: "locations.location.address1" })}
                  showPlaceholder={!!location.address1}
                  value={location.address1 || EMPTY_STRING}
                  onChange={onValueChange("address1")}
                  data-testid="locationAddress1Input"
                />
                <InputWithPlaceholder
                  key="locationAddress2Input"
                  placeholder={formatMessage({ id: "locations.location.address2" })}
                  showPlaceholder={!!location.address2}
                  value={location.address2 || EMPTY_STRING}
                  onChange={onValueChange("address2")}
                  data-testid="locationAddress2Input"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationCityVillageInput"
                  placeholder={formatMessage({ id: "locations.location.cityVillage" })}
                  showPlaceholder={!!location.cityVillage}
                  value={location.cityVillage || EMPTY_STRING}
                  onChange={onValueChange("cityVillage")}
                  data-testid="locationCityVillageInput"
                />
                <InputWithPlaceholder
                  key="locationStateProvinceInput"
                  placeholder={formatMessage({ id: "locations.location.stateProvince" })}
                  showPlaceholder={!!location.stateProvince}
                  value={location.stateProvince || EMPTY_STRING}
                  onChange={onValueChange("stateProvince")}
                  data-testid="locationStateProvinceInput"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationPostalCodeInput"
                  placeholder={formatMessage({ id: "locations.location.postalCode" })}
                  showPlaceholder={!!location.postalCode}
                  value={location.postalCode || EMPTY_STRING}
                  onChange={onValueChange("postalCode")}
                  data-testid="locationPostalCodeInput"
                />
                <div className="input-container">
                  <SelectWithPlaceholder
                    key="locationCountryInput"
                    placeholder={formatMessage({ id: "locations.location.country" })}
                    showPlaceholder={!isCountryEmpty}
                    value={countryOptions.find(({ value }) => value === location.country)}
                    onChange={onCountryValueChange}
                    options={countryOptions}
                    wrapperClassName={cx("flex-1", { invalid: showValidationErrors && isCountryEmpty })}
                    classNamePrefix="default-select"
                    theme={selectDefaultTheme}
                  />
                  {showValidationErrors && isCountryEmpty && <ValidationError message="common.error.required" />}
                </div>
              </div>
              {locationAttributeTypesGrouped?.map((locationAttributeTypesGroup, idx) => (
                <div className="inline-fields" key={`locationAttributeTypesGroup${idx}`}>
                  {locationAttributeTypesGroup.map((locationAttributeType) => input(locationAttributeType))}
                </div>
              ))}
            </div>
            <div className="mt-5 pb-5">
              <div className="d-inline">
                <Button className="cancel" onClick={onReturn} data-testid="returnButton">
                  <FormattedMessage id="common.cancel" />
                </Button>
              </div>
              <div className="d-inline pull-right confirm-button-container">
                <Button className="save" onClick={onSave} data-testid="saveButton">
                  <FormattedMessage id="common.confirm" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  location: {
    loadingLocationAttributeTypes,
    locationAttributeTypes,
    locations,
    success,
    loadingLocation,
    location: editedLocation,
  },
  settings: { loading: loadingSetting, setting },
  concept: {
    concept: { setMembers: countries },
    loading: { concept: loadingConcept },
  },
  project: { projects },
}: IStore) => ({
  isLocationLoading: loadingLocationAttributeTypes || loadingLocation || loadingSetting || loadingConcept,
  locationAttributeTypes: locationAttributeTypes.filter((locationAttributeType) => !locationAttributeType.retired),
  locations,
  success,
  editedLocation,
  settingValue: setting?.value,
  projects,
  countryOptions: countries
    .sort((countryA, countryB) => countryA.display.localeCompare(countryB.display))
    .map(({ display }) => ({ label: display, value: display })),
  countryNames: countries.map(({ display: fullySpecified, names }) => ({
    fullySpecified,
    short: names.find(({ display }) => display !== fullySpecified)?.display,
  })),
  countryClusters: countries.map(({ display: countryName, setMembers }) => ({
    countryName,
    clusters: setMembers.map(({ display: clusterName }) => clusterName),
  })),
});

const mapDispatchToProps = {
  getLocationAttributeTypes,
  searchLocations,
  saveLocation,
  getLocation,
  getSettingByQuery,
  getConcept,
  getProjectNames,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(Location)));
