import React, { FormEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Button, Spinner, Form } from 'reactstrap';
import PersonDetails from './PersonDetails';
import AuditInfo from './AuditInfo';
import UserAccountDetails from './UserAccountDetails';
import { searchLocations } from '../../redux/reducers/location';
import { getRoles } from '../../redux/reducers/role';
import { getUsers, getUserByPersonId, saveUser, deleteUser } from '../../redux/reducers/user';
import { extractEventValue } from '../../shared/util/form-util';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { uniq, isNil } from 'lodash';
import cx from 'classnames';
import { IUserAccountFields, IDetailsOption, ICurrentUser, IPersonAttribute } from '../../shared/models/user-account';
import '../Inputs.scss';
import './UserAccount.scss';
import { getSettingByQuery } from '../../redux/reducers/setttings';
import { getPerson } from '../../redux/reducers/person';
import { parseJson } from '../../shared/util/json-util';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import {
  SETTING_ATRRIBUTE_TYPES,
  DEFAULT_USER_VALUES,
  DEFAULT_EDIT_USER_PASSWORD,
  GENDER_OTHER,
  PHONE_FIELD,
  EMAIL_FIELD,
  EMAIL_REGEX,
  USER_NAME_FIELD,
  LOCATION_FIELD,
  USER_ROLE_FIELD,
  PASSWORD_FIELD,
  PASSWORD_REGEX,
  CONFIRM_PASSWORD_FIELD
} from '../../shared/constants/user-account';

interface State2Props {
  role: { loading: boolean; roles: IDetailsOption[] };
  location: { locations: IDetailsOption[] };
  user: { loading: boolean; users: IDetailsOption[]; currentUser: ICurrentUser; success: boolean };
  settings: { setting: { value: string } };
  cflPerson: { person: { preferredName: { familyName: string; givenName: string }; attributes: IPersonAttribute[] } };
}

interface ILocationProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: IntlShape;
}

const locationHash = window.location.hash;
const positionPersonId = locationHash.indexOf('personId=');
const personId = positionPersonId !== -1 ? locationHash.slice(positionPersonId, locationHash.length) : '';

const UserAccount = (props: ILocationProps) => {
  const {
    intl,
    userLoading,
    locations,
    roles,
    users,
    currentUser,
    setting,
    person,
    success,
    searchLocations,
    getRoles,
    getUsers,
    getUserByPersonId,
    getSettingByQuery,
    getPerson,
    saveUser,
    deleteUser
  } = props;

  const personUuid = currentUser?.person?.uuid;
  const personAtributeTypes = parseJson(setting?.value);

  const [fields, setFields] = useState<IUserAccountFields>(DEFAULT_USER_VALUES);
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);
  const [forcePassword, setForcePassword] = useState(true);

  useEffect(() => {
    success && onReturn();
  }, [success]);

  useEffect(() => {
    searchLocations();
    getRoles();
    getUsers();
    getSettingByQuery(SETTING_ATRRIBUTE_TYPES);
    personId && getUserByPersonId(personId);
    personId && personUuid && getPerson(personUuid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    personUuid && getPerson(personUuid);
  }, [personUuid, getPerson]);

  useEffect(() => {
    if (person) {
      const {
        preferredName: { familyName, givenName },
        attributes
      } = person;
      const {
        username,
        allRoles,
        userProperties: { locationUuid }
      } = currentUser;
      const [userRole] = allRoles;
      const { display: label, uuid: value } = userRole;
      const { phone: phoneUuid, email: emailUuid } = personAtributeTypes;
      const locationUuidArray = locationUuid.split(',').map(uuid1 => locations.find(({ uuid: uuid2 }) => uuid1 === uuid2));

      setForcePassword(false);
      setFields({
        familyName: { ...fields.familyName, value: familyName },
        givenName: { ...fields.givenName, value: givenName },
        phone: { ...fields.phone, value: attributes.find(({ attributeType }) => attributeType.uuid === phoneUuid).value },
        email: { ...fields.email, value: attributes.find(({ attributeType }) => attributeType.uuid === emailUuid).value },
        userName: { ...fields.userName, value: username },
        locations: { ...fields.locations, value: locationUuidArray.map(option => ({ label: option.display, value: option.uuid })) },
        userRole: { ...fields.userRole, value: { label, value } },
        password: { ...fields.password, value: DEFAULT_EDIT_USER_PASSWORD },
        confirmPassword: { ...fields.confirmPassword, value: DEFAULT_EDIT_USER_PASSWORD }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person, currentUser]);

  const onValueChange = (name: string) => (e: FormEvent) => {
    const fieldValue = extractEventValue(e) || '';
    const isDirty = dirtyFields.some(field => field === name);
    const isEmpty = isDirty && !fieldValue;
    const is = (fieldName: string) => name === fieldName;

    let isFieldValid = true;
    let errorMessage = '';

    if (is(PHONE_FIELD) && !isPossiblePhoneNumber(fieldValue)) {
      isFieldValid = false;
      errorMessage = 'registerPatient.invalidPhoneNumber';
    }

    if (is(EMAIL_FIELD) && !EMAIL_REGEX.test(fieldValue)) {
      isFieldValid = false;
      errorMessage = 'common.error.invalidEmail';
    }

    if (is(USER_NAME_FIELD)) {
      const omitCurrentUser = users.filter(({ uuid }) => uuid !== currentUser.uuid);
      const isUserNameUnique = omitCurrentUser.every(({ display }) => display.toLowerCase() !== fieldValue.toLowerCase());

      if (!isUserNameUnique) {
        isFieldValid = false;
        errorMessage = 'common.error.nameUnique';
      }
    }

    if (is(PASSWORD_FIELD)) {
      const isPasswordValid = fieldValue ? PASSWORD_REGEX.test(fieldValue) : false;

      if (!isPasswordValid) {
        isFieldValid = false;
        errorMessage = 'common.error.invalidPassword';
      }
    }

    if (is(CONFIRM_PASSWORD_FIELD)) {
      const equalPasswords = fields.password.value === fieldValue;

      if (!equalPasswords) {
        isFieldValid = false;
        errorMessage = 'common.error.confirmPassword';
      }
    }

    if (isEmpty || (is(LOCATION_FIELD) && !fieldValue.length && isDirty) || (is(USER_ROLE_FIELD) && !fieldValue?.value && isDirty)) {
      isFieldValid = false;
      errorMessage = 'common.error.required';
    }

    setFields({ ...fields, [name]: { ...fields[name], value: fieldValue, isValid: isFieldValid, error: errorMessage } });
    setDirtyFields(uniq([...dirtyFields, name]));
  };

  const payload = {
    username: fields.userName.value,
    ...(dirtyFields.find(field => field === PASSWORD_FIELD) && { password: fields.password.value }),
    userProperties: {
      forcePassword: String(forcePassword),
      locationUuid: fields?.locations.value.map(({ value }) => value).join(',')
    },
    roles: [
      {
        uuid: fields?.userRole.value?.value,
        name: fields?.userRole.value?.label
      }
    ],
    person: {
      gender: GENDER_OTHER,
      attributes: [
        {
          attributeType: personAtributeTypes.phone,
          value: fields.phone.value
        },
        {
          attributeType: personAtributeTypes.email,
          value: fields.email.value
        }
      ],
      names: [
        {
          givenName: fields.givenName.value,
          familyName: fields.familyName.value
        }
      ]
    }
  };

  const onReturn = () => (window.location.href = `${ROOT_URL}adminui/systemadmin/accounts/manageAccounts.page`);
  const onSave = () => {
    const isFormValid = Object.values(fields).every(({ value, isValid }) => value && isValid);

    if (isFormValid) {
      saveUser(payload, currentUser?.uuid);
      successToast(intl.formatMessage({ id: 'userAccount.accountSaved' }));
    } else {
      errorToast(intl.formatMessage({ id: 'userAccount.accountNotSaved' }));
    }
  };
  const onDelete = () => {
    deleteUser(currentUser?.uuid);
    successToast(intl.formatMessage({ id: 'userAccount.accountDeleted' }));
  };

  return (
    <div className={cx('user-account', { edit: personId })}>
      <FormattedMessage id={`userAccount.${!personId ? 'add' : 'edit'}`} tagName="h2" />
      {userLoading ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          {personId && (
            <div className="d-inline pull-right">
              <Button className="delete" onClick={onDelete} data-testid="deleteAccount">
                <FormattedMessage id="userAccount.deleteAccount" />
              </Button>
            </div>
          )}
          <Form className={cx({ hide: userLoading })}>
            <div className="section person">
              <PersonDetails intl={intl} onValueChange={onValueChange} fields={fields} />
            </div>
            {personId && (
              <div className="section audit">
                <AuditInfo intl={intl} audit={currentUser?.auditInfo} />
              </div>
            )}
            <div className="section user">
              <UserAccountDetails
                intl={intl}
                onValueChange={onValueChange}
                fields={fields}
                dirtyFields={dirtyFields}
                locations={locations}
                roles={roles}
                setForcePassword={setForcePassword}
                forcePassword={forcePassword}
              />
            </div>
            <div className="buttons mt-5 pb-5">
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
          </Form>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({ role, location, user, settings, cflPerson }: State2Props) => ({
  userLoading: !personId ? user.loading : isNil(cflPerson.person),
  locations: location.locations,
  roles: role.roles,
  users: user.users,
  currentUser: user.currentUser,
  setting: settings.setting,
  person: cflPerson.person,
  success: user.success
});
const mapDispatchToProps = {
  searchLocations,
  getRoles,
  getUsers,
  getUserByPersonId,
  getSettingByQuery,
  getPerson,
  saveUser,
  deleteUser
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(UserAccount)));
