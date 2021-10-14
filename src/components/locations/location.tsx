import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './location.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import '../Inputs.scss';
import { Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { InputWithPlaceholder, RadioButtonsWithPlaceholder, SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { extractEventValue, selectDefaultTheme } from '../../shared/util/form-util';
import { getLocationAttributeTypes, searchLocations, saveLocation } from '../../redux/reducers/location';
import { chunk } from 'lodash';
import { ILocation, ILocationAttributeType } from '../../shared/models/location';
import { STRING_FALSE, STRING_TRUE } from '../../shared/constants/input';
import { TextareaWithPlaceholder } from '../common/textarea/Textarea';
import ValidationError from '../common/form/ValidationError';
import { scrollToTop } from '../../shared/util/window-util';
import cx from 'classnames';

export interface ILocationProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

const DEFAULT_LOCATION: ILocation = {
  name: '',
  description: '',
  address1: '',
  address2: '',
  cityVillage: '',
  stateProvince: '',
  country: '',
  postalCode: '',
  tags: [],
  attributes: []
};
const COLUMNS = 2;
const DROPDOWN_HANDLER_CONFIG_SEPARATOR = ',';
const BOOLEAN_RADIOS_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.BooleanFieldGenDatatypeHandler';
const DROPDOWN_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.SpecifiedTextOptionsDropdownHandler';
const TEXTAREA_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.LongFreeTextTextareaHandler';

const Location = (props: ILocationProps) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  useEffect(() => {
    props.getLocationAttributeTypes();
    props.searchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReturn = () => {
    window.location.href = `${ROOT_URL}adminui/metadata/locations/manageLocations.page`;
  };

  const onSave = () => {
    if (isLocationNameEmpty || isLocationNameDuplicated) {
      setShowValidationErrors(true);
      scrollToTop();
    } else props.saveLocation(location);
  };

  useEffect(() => {
    if (props.success) {
      onReturn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.success]);

  const onValueChange = (name: string) => (event: any) => setLocation({ ...location, [name]: extractEventValue(event) });

  const onAttributeValueChange = (uuid: string) => (event: any) => {
    let attributes = location.attributes;
    const attribute = attributes.find(attribute => attribute.attributeType === uuid);
    const value = extractEventValue(event);

    if (attribute) {
      attribute.value = value;
    } else {
      attributes = [...location.attributes, { attributeType: uuid, value }];
    }

    setLocation({ ...location, attributes });
  };

  const isLocationNameEmpty = !location.name;

  const isLocationNameDuplicated = props.locations.map(location => location?.display?.toLowerCase()).includes(location.name?.toLowerCase());

  const isCountryEmpty = !location.country;

  const locationAttributeTypesGrouped: Array<Array<ILocationAttributeType>> = chunk(props.locationAttributeTypes, COLUMNS);

  const input = (locationAttributeType: ILocationAttributeType) => {
    const key = `locationAttribute${locationAttributeType.uuid}`;
    const placeholder = locationAttributeType.name;
    const value = location.attributes.find(attribute => locationAttributeType.uuid === attribute.attributeType)?.value;
    const onChange = onAttributeValueChange(locationAttributeType.uuid);

    switch (locationAttributeType.preferredHandlerClassname) {
      case DROPDOWN_PREFERRED_HANDLER:
        const options = locationAttributeType.handlerConfig
          .split(DROPDOWN_HANDLER_CONFIG_SEPARATOR)
          .map(value => ({ label: value, value }));
        return (
          <SelectWithPlaceholder
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={options.find(option => option.value === value)}
            onChange={option => onChange(option.value)}
            options={options}
            wrapperClassName="flex-1"
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
          />
        );
      case BOOLEAN_RADIOS_PREFERRED_HANDLER:
        return (
          <RadioButtonsWithPlaceholder
            name={key}
            onChange={event => onChange((event.target as HTMLInputElement).value === STRING_TRUE)}
            options={[
              { value: STRING_TRUE, label: props.intl.formatMessage({ id: 'common.true' }) },
              { value: STRING_FALSE, label: props.intl.formatMessage({ id: 'common.false' }) }
            ]}
            placeholder={placeholder}
            showPlaceholder
          />
        );
      case TEXTAREA_PREFERRED_HANDLER:
        return (
          <TextareaWithPlaceholder
            key={key}
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={value}
            onChange={onChange}
            isResizable
          />
        );
      default:
        return <InputWithPlaceholder key={key} placeholder={placeholder} showPlaceholder={!!value} value={value} onChange={onChange} />;
    }
  };

  return (
    <div id="location">
      <h2>
        <FormattedMessage id="locations.location.title" />
      </h2>
      <div className="inner-content">
        {props.loadingLocationAttributeTypes ? (
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
                    placeholder={props.intl.formatMessage({ id: 'locations.location.name' })}
                    showPlaceholder={!!location.name}
                    value={location.name}
                    onChange={onValueChange('name')}
                    className={cx({ invalid: showValidationErrors && (isLocationNameEmpty || isLocationNameDuplicated) })}
                  />
                  {showValidationErrors &&
                    (isLocationNameEmpty ? (
                      <ValidationError message="locations.location.error.required" />
                    ) : (
                      isLocationNameDuplicated && <ValidationError message="locations.location.error.nameUnique" />
                    ))}
                </div>
                <InputWithPlaceholder
                  key="locationDescriptionInput"
                  placeholder={props.intl.formatMessage({ id: 'locations.location.description' })}
                  showPlaceholder={!!location.description}
                  value={location.description}
                  onChange={onValueChange('description')}
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationAddress1Input"
                  placeholder={props.intl.formatMessage({ id: 'locations.location.address1' })}
                  showPlaceholder={!!location.address1}
                  value={location.address1}
                  onChange={onValueChange('address1')}
                />
                <InputWithPlaceholder
                  key="locationAddress2Input"
                  placeholder={props.intl.formatMessage({ id: 'locations.location.address2' })}
                  showPlaceholder={!!location.address2}
                  value={location.address2}
                  onChange={onValueChange('address2')}
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationCityVillageInput"
                  placeholder={props.intl.formatMessage({ id: 'locations.location.cityVillage' })}
                  showPlaceholder={!!location.cityVillage}
                  value={location.cityVillage}
                  onChange={onValueChange('cityVillage')}
                />
                <InputWithPlaceholder
                  key="locationStateProvinceInput"
                  placeholder={props.intl.formatMessage({ id: 'locations.location.stateProvince' })}
                  showPlaceholder={!!location.stateProvince}
                  value={location.stateProvince}
                  onChange={onValueChange('stateProvince')}
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationPostalCodeInput"
                  placeholder={props.intl.formatMessage({ id: 'locations.location.postalCode' })}
                  showPlaceholder={!!location.postalCode}
                  value={location.postalCode}
                  onChange={onValueChange('postalCode')}
                />
                <div className="input-container">
                  <InputWithPlaceholder
                    key="locationCountryInput"
                    placeholder={props.intl.formatMessage({ id: 'locations.location.country' })}
                    showPlaceholder={!!location.country}
                    value={location.country}
                    onChange={onValueChange('country')}
                    className={cx({ invalid: showValidationErrors && isCountryEmpty })}
                  />
                  {showValidationErrors && isCountryEmpty && <ValidationError message="locations.location.error.required" />}
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
                <Button className="cancel" onClick={onReturn}>
                  <FormattedMessage id="common.return" />
                </Button>
              </div>
              <div className="d-inline pull-right confirm-button-container">
                <Button className="save" onClick={onSave}>
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

const mapStateToProps = ({ location }) => ({
  loadingLocationAttributeTypes: location.loadingLocationAttributeTypes as boolean,
  locationAttributeTypes: (location.locationAttributeTypes as Array<ILocationAttributeType>).filter(
    locationAttributeType => !locationAttributeType.retired
  ),
  locations: location.locations as Array<any>,
  success: location.success as boolean
});

const mapDispatchToProps = { getLocationAttributeTypes, searchLocations, saveLocation };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(Location)));
