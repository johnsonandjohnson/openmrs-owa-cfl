import React, { ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './Location.scss';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import '../Inputs.scss';
import { Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { InputWithPlaceholder, RadioButtonsWithPlaceholder, SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { extractEventValue, selectDefaultTheme } from '../../shared/util/form-util';
import { getLocationAttributeTypes, searchLocations, saveLocation, getLocation } from '../../redux/reducers/location';
import { chunk, cloneDeep, uniq } from 'lodash';
import { ILocation, ILocationAttributeType, ILocationListItem } from '../../shared/models/location';
import { EMPTY_STRING, STRING_FALSE, STRING_TRUE } from '../../shared/constants/input';
import { TextareaWithPlaceholder } from '../common/textarea/Textarea';
import ValidationError from '../common/form/ValidationError';
import { scrollToTop } from '../../shared/util/window-util';
import cx from 'classnames';
import { getSettingByQuery } from '../../redux/reducers/setttings';
import { getConcept } from '../../redux/reducers/concept';
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
  MANDATORY_LOCATION_ATTRIBUTE_TYPE_UUID
} from '../../shared/constants/location';
import { COUNTRY_CONCEPT_UUID, COUNTRY_CONCEPT_REPRESENTATION } from '../../shared/constants/concept';
import { IConcept } from '../../shared/models/concept';

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
    concept: IConcept;
    loading: {
      concept: boolean;
    };
  };
}

interface IUrlParams {
  locationId: string;
}

interface IOption {
  label: string;
  value: string;
}

export const Location = (props: ILocationProps) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const {
    intl: { formatMessage }
  } = props;
  const { locationId } = props.match.params as IUrlParams;

  useEffect(() => {
    props.getLocationAttributeTypes();
    props.searchLocations();
    props.getSettingByQuery(LOCATION_DEFAULT_TAG_LIST_SETTING_KEY);
    props.getConcept(COUNTRY_CONCEPT_UUID, COUNTRY_CONCEPT_REPRESENTATION);
    if (locationId) {
      props.getLocation(locationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.editedLocation) {
      setLocation(props.editedLocation);
    }
  }, [props.editedLocation]);

  const onReturn = () => {
    window.location.href = `${ROOT_URL}adminui/metadata/locations/manageLocations.page`;
  };

  const onSave = () => {
    const requiredLocationAttributeTypes = props.locationAttributeTypes.filter(
      locationAttributeType => locationAttributeType.minOccurs === REQUIRED_OCCURRENCE
    );
    const isAllRequiredLocationAttributeTypesFilled = requiredLocationAttributeTypes.every(({ uuid: requiredLocationAttributeTypeUuid }) =>
      location.attributes.find(({ attributeType, value }) => requiredLocationAttributeTypeUuid === attributeType.uuid && value)
    );

    if (isLocationNameEmpty || isLocationNameDuplicated || isCountryEmpty || !isAllRequiredLocationAttributeTypesFilled) {
      setShowValidationErrors(true);
      scrollToTop();
    } else {
      const preparedLocation = cloneDeep(location) as ILocation;
      const locationDefaultTags = props.settingValue ? JSON.parse(props.settingValue) : [];

      preparedLocation.attributes = preparedLocation.attributes
        .filter(attribute => attribute.value !== '')
        .map(({ attributeType, value }) => ({ attributeType, value }));
      preparedLocation.tags = uniq([...preparedLocation.tags, ...locationDefaultTags]);

      props.saveLocation(preparedLocation);
    }
  };

  useEffect(() => {
    if (props.success) {
      onReturn();
    }
  }, [props.success]);

  const onValueChange = (name: string) => (event: ChangeEvent) => setLocation({ ...location, [name]: extractEventValue(event) });

  const onCountryValueChange = (event: ChangeEvent) => {
    let attributes = location.attributes;
    const countryFullySpecifiedName: IOption = extractEventValue(event);
    const countryShortName = props.countryNames.find(({ fullySpecified }) => fullySpecified === countryFullySpecifiedName.value)?.short;

    if (props.locationAttributeTypes.map(({ uuid }) => uuid).includes(COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID)) {
      const countryCodeAttribute = attributes.find(({ attributeType }) => attributeType.uuid === COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID);

      //fill in Country Code based on the selected Country
      if (countryCodeAttribute) {
        countryCodeAttribute.value = countryShortName;
      } else {
        attributes = [
          ...location.attributes,
          { attributeType: { uuid: COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID }, value: countryShortName }
        ];
      }
    }

    if (props.locationAttributeTypes.map(({ uuid }) => uuid).includes(CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID)) {
      const clusterAttribute = attributes.find(({ attributeType }) => attributeType.uuid === CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID);

      //clear Cluster value on Country change
      if (clusterAttribute) {
        clusterAttribute.value = null;
      }
    }

    setLocation({ ...location, country: countryFullySpecifiedName.value, attributes });
  };

  const onAttributeValueChange = (uuid: string) => (event: ChangeEvent | string) => {
    let attributes = location.attributes;
    const attribute = attributes.find(attribute => attribute.attributeType.uuid === uuid);
    const value = extractEventValue(event);

    if (attribute) {
      attribute.value = value;
    } else {
      attributes = [...location.attributes, { attributeType: { uuid }, value }];
    }

    setLocation({ ...location, attributes });
  };

  const isLocationNameEmpty = !location.name;

  const isLocationNameDuplicated = props.locations
    .filter(loc => loc.uuid !== location.uuid)
    .map(loc => loc.display.toLowerCase())
    .includes(location.name.toLowerCase());

  const isCountryEmpty = !location.country;

  const locationAttributeTypesGrouped: Array<Array<ILocationAttributeType>> = chunk(props.locationAttributeTypes, COLUMNS);

  const input = (locationAttributeType: ILocationAttributeType) => {
    const key = `locationAttribute${locationAttributeType.uuid}`;
    const placeholder = locationAttributeType.name;
    const value = location.attributes.find(attribute => locationAttributeType.uuid === attribute.attributeType.uuid)?.value;
    const isRequired =
      locationAttributeType.minOccurs === REQUIRED_OCCURRENCE ||
      MANDATORY_LOCATION_ATTRIBUTE_TYPE_UUID.includes(locationAttributeType.uuid);
    const isInvalid = isRequired && !value;
    const onChange = onAttributeValueChange(locationAttributeType.uuid);

    if (locationAttributeType.uuid === CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID) {
      const countryClusters = props.countryClusters.find(({ countryName }) => countryName === location.country)?.clusters;
      const options = countryClusters?.map(clusterName => ({ label: clusterName, value: clusterName })) ?? [];
      return (
        <div className="input-container" key={key}>
          <SelectWithPlaceholder
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={value && options.find(option => option.value === value)}
            onChange={(option: IOption) => onChange(option.value)}
            options={options}
            wrapperClassName={cx('flex-1', { invalid: showValidationErrors && isInvalid })}
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
            isDisabled={isCountryEmpty}
          />
          {showValidationErrors && isInvalid && <ValidationError message="common.error.required" />}
        </div>
      );
    } else if (locationAttributeType.uuid === COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID) {
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
      switch (locationAttributeType.preferredHandlerClassname) {
        case DROPDOWN_PREFERRED_HANDLER:
          const options: Array<IOption> = locationAttributeType.handlerConfig
            .split(DROPDOWN_HANDLER_CONFIG_SEPARATOR)
            .map(value => ({ label: value, value }));
          return (
            <div className="input-container" key={key}>
              <SelectWithPlaceholder
                placeholder={placeholder}
                showPlaceholder={!!value}
                value={options.find(option => option.value === value)}
                onChange={(option: IOption) => onChange(option.value)}
                options={options}
                wrapperClassName={cx('flex-1', { invalid: showValidationErrors && isInvalid })}
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
                { value: STRING_TRUE, label: formatMessage({ id: 'common.true' }) },
                { value: STRING_FALSE, label: formatMessage({ id: 'common.false' }) }
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
        <FormattedMessage id={`locations.location.${locationId ? 'edit' : 'create'}.title`} />
      </h2>
      <div className="inner-content">
        {props.isLocationLoading ? (
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
                    placeholder={formatMessage({ id: 'locations.location.name' })}
                    showPlaceholder={!!location.name}
                    value={location.name || EMPTY_STRING}
                    onChange={onValueChange('name')}
                    className={cx({ invalid: showValidationErrors && (isLocationNameEmpty || isLocationNameDuplicated) })}
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
                  placeholder={formatMessage({ id: 'locations.location.description' })}
                  showPlaceholder={!!location.description}
                  value={location.description || EMPTY_STRING}
                  onChange={onValueChange('description')}
                  data-testid="locationDescriptionInput"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationAddress1Input"
                  placeholder={formatMessage({ id: 'locations.location.address1' })}
                  showPlaceholder={!!location.address1}
                  value={location.address1 || EMPTY_STRING}
                  onChange={onValueChange('address1')}
                  data-testid="locationAddress1Input"
                />
                <InputWithPlaceholder
                  key="locationAddress2Input"
                  placeholder={formatMessage({ id: 'locations.location.address2' })}
                  showPlaceholder={!!location.address2}
                  value={location.address2 || EMPTY_STRING}
                  onChange={onValueChange('address2')}
                  data-testid="locationAddress2Input"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationCityVillageInput"
                  placeholder={formatMessage({ id: 'locations.location.cityVillage' })}
                  showPlaceholder={!!location.cityVillage}
                  value={location.cityVillage || EMPTY_STRING}
                  onChange={onValueChange('cityVillage')}
                  data-testid="locationCityVillageInput"
                />
                <InputWithPlaceholder
                  key="locationStateProvinceInput"
                  placeholder={formatMessage({ id: 'locations.location.stateProvince' })}
                  showPlaceholder={!!location.stateProvince}
                  value={location.stateProvince || EMPTY_STRING}
                  onChange={onValueChange('stateProvince')}
                  data-testid="locationStateProvinceInput"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationPostalCodeInput"
                  placeholder={formatMessage({ id: 'locations.location.postalCode' })}
                  showPlaceholder={!!location.postalCode}
                  value={location.postalCode || EMPTY_STRING}
                  onChange={onValueChange('postalCode')}
                  data-testid="locationPostalCodeInput"
                />
                <div className="input-container">
                  <SelectWithPlaceholder
                    key="locationCountryInput"
                    placeholder={formatMessage({ id: 'locations.location.country' })}
                    showPlaceholder={!isCountryEmpty}
                    value={props.countryOptions.find(({ value }) => value === location.country)}
                    onChange={onCountryValueChange}
                    options={props.countryOptions}
                    wrapperClassName={cx('flex-1', { invalid: showValidationErrors && isCountryEmpty })}
                    classNamePrefix="default-select"
                    theme={selectDefaultTheme}
                  />
                  {showValidationErrors && isCountryEmpty && <ValidationError message="common.error.required" />}
                </div>
              </div>
              {locationAttributeTypesGrouped?.map((locationAttributeTypesGroup, idx) => (
                <div className="inline-fields" key={`locationAttributeTypesGroup${idx}`}>
                  {locationAttributeTypesGroup.map(locationAttributeType => input(locationAttributeType))}
                </div>
              ))}
            </div>
            <div className="mt-5 pb-5">
              <div className="d-inline">
                <Button className="cancel" onClick={onReturn} data-testid="returnButton">
                  <FormattedMessage id="common.return" />
                </Button>
              </div>
              <div className="d-inline pull-right confirm-button-container">
                <Button className="save" onClick={onSave} data-testid="saveButton">
                  <FormattedMessage id="common.save" />
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
  location: { loadingLocationAttributeTypes, locationAttributeTypes, locations, success, loadingLocation, location: editedLocation },
  settings: { loading: loadingSetting, setting },
  concept: {
    concept,
    loading: { concept: loadingConcept }
  }
}: IStore) => ({
  isLocationLoading: loadingLocationAttributeTypes || loadingLocation || loadingSetting || loadingConcept,
  locationAttributeTypes: locationAttributeTypes.filter(locationAttributeType => !locationAttributeType.retired),
  locations,
  success,
  editedLocation,
  settingValue: setting?.value,
  countryOptions: concept.setMembers
    .sort((countryA, countryB) => countryA.display.localeCompare(countryB.display))
    .map(({ display }) => ({ label: display, value: display })),
  countryNames: concept.setMembers.map(({ display: fullySpecified, names }) => ({
    fullySpecified,
    short: names.find(({ display }) => display !== fullySpecified)?.display
  })),
  countryClusters: concept.setMembers.map(({ display: countryName, setMembers }) => ({
    countryName,
    clusters: setMembers.map(({ display: clusterName }) => clusterName)
  }))
});

const mapDispatchToProps = { getLocationAttributeTypes, searchLocations, saveLocation, getLocation, getSettingByQuery, getConcept };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(Location)));
