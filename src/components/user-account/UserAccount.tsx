/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { FormEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl, IntlShape } from "react-intl";
import { Button, Spinner, Form } from "reactstrap";
import PersonDetails from "./PersonDetails";
import AuditInfo from "./AuditInfo";
import UserAccountDetails from "./UserAccountDetails";
import { searchLocations } from "../../redux/reducers/location";
import { getRoles } from "../../redux/reducers/role";
import {
  getUsers,
  getProviders,
  getUserByPersonId,
  saveUser,
  saveProvider,
  deleteUser,
  deleteProvider,
} from "../../redux/reducers/user";
import { extractEventValue } from "../../shared/util/form-util";
import { ROOT_URL } from "../../shared/constants/openmrs";
import { uniq, isNil } from "lodash";
import cx from "classnames";
import _ from "lodash";
import { IUserAccount, IDetailsOption, ICurrentUser, IPersonAttribute } from "../../shared/models/user-account";
import "../Inputs.scss";
import "./UserAccount.scss";
import { getSettingByQuery, getSettings } from "../../redux/reducers/settings";
import { getPerson } from "../../redux/reducers/person";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { errorToast } from "../toast-handler/toast-handler";
import {
  PERSON_ID_LOOKUP_STRING,
  SETTING_ATTRIBUTE_TYPE_PREFIX,
  SETTING_EMAIL_ADDRESS_ATRRIBUTE_TYPE,
  SETTING_TELEPHONE_NUMBER_ATRRIBUTE_TYPE,
  DEFAULT_USER_VALUES,
  DEFAULT_EDIT_USER_PASSWORD,
  GENDER_OTHER,
  PHONE_FIELD,
  EMAIL_FIELD,
  EMAIL_REGEX,
  USERNAME_FIELD,
  LOCATION_FIELD,
  USER_ROLE_FIELD,
  PASSWORD_FIELD,
  PASSWORD_REGEX,
  CONFIRM_PASSWORD_FIELD,
  USERNAME_REGEX,
  ROLE_UUIDS_TO_HIDE_GP_KEY,
} from "../../shared/constants/user-account";
import { EMPTY_STRING } from "src/shared/constants/input";
import { ConfirmationModal } from "../common/form/ConfirmationModal";

interface IStore {
  role: { loading: boolean; roles: IDetailsOption[] };
  location: { locations: IDetailsOption[] };
  user: {
    loading: boolean;
    users: IDetailsOption[];
    currentUser: ICurrentUser;
    providers: [
      {
        uuid: string;
        person: {
          uuid: string;
        };
      },
    ];
    updatedUser: {
      person: {
        uuid: string;
      };
    };
    success: {
      createUser: boolean;
      createProvider: boolean;
      deleteUser: boolean;
      deleteProvider: boolean;
    };
  };
  settings: { settings: [{ property: string; value: string }]; loading: boolean; setting: any };
  cflPerson: {
    person: {
      uuid: string;
      preferredName: { uuid: string; familyName: string; givenName: string };
      attributes: IPersonAttribute[];
      gender: string;
    };
  };
}

interface ILocationProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: IntlShape;
}

const locationHash = window.location.hash;
const positionPersonId = locationHash.indexOf(PERSON_ID_LOOKUP_STRING);
const personId = positionPersonId !== -1 ? locationHash.slice(positionPersonId + PERSON_ID_LOOKUP_STRING.length) : null;

const UserAccount = (props: ILocationProps) => {
  const {
    intl,
    userLoading,
    locations,
    roles,
    users,
    provider,
    currentUser,
    settings,
    loadingSettings,
    setting,
    person,
    updatedUser,
    successCreateUser,
    successCreateProvider,
    successDeleteUser,
    successDeleteProvider,
    searchLocations,
    getRoles,
    getProviders,
    getUsers,
    getUserByPersonId,
    getSettings,
    getSettingByQuery,
    getPerson,
    saveUser,
    saveProvider,
    deleteUser,
    deleteProvider,
  } = props;

  const personUuid = currentUser?.person?.uuid;
  const userUuid = currentUser?.uuid;
  const emailAddressAtributeTypeUuid = settings?.find(
    (setting) => setting.property === SETTING_EMAIL_ADDRESS_ATRRIBUTE_TYPE,
  )?.value;
  const telephoneNumberAtributeTypeUuid = settings?.find(
    (setting) => setting.property === SETTING_TELEPHONE_NUMBER_ATRRIBUTE_TYPE,
  )?.value;
  const roleUuidsToHide = setting?.value;

  const [userAccount, setUserAccount] = useState<IUserAccount>(DEFAULT_USER_VALUES);
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);
  const [forcePassword, setForcePassword] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    if ((successCreateUser && successCreateProvider) || (successDeleteUser && successDeleteProvider)) {
      onReturn();
    }
  }, [successCreateUser, successCreateProvider, successDeleteProvider, successDeleteUser]);

  useEffect(() => {
    if (successCreateUser && !successCreateProvider) {
      const {
        familyName: { value: familyNameValue },
        givenName: { value: givenNameValue },
        username: { value: usernameValue },
      } = userAccount;

      const providerDataToSave = {
        uuid: provider?.uuid,
        data: {
          name: `${givenNameValue} ${familyNameValue}`,
          person: updatedUser.person.uuid,
          identifier: usernameValue,
        },
      };

      saveProvider(providerDataToSave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successCreateUser, successCreateProvider]);

  useEffect(() => {
    searchLocations();
    getRoles();
    getUsers();
    getSettings(SETTING_ATTRIBUTE_TYPE_PREFIX);
    getSettingByQuery(ROLE_UUIDS_TO_HIDE_GP_KEY);
    personId && getUserByPersonId(personId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    personUuid && getPerson(personUuid);
  }, [personUuid, getPerson]);

  useEffect(() => {
    if (person) {
      const {
        preferredName: { familyName, givenName },
        attributes,
      } = person;
      const {
        username,
        roles: currentUserRoles = [],
        userProperties: { locationUuid: locationUuidString },
      } = currentUser;
      const [userRole = {}] = currentUserRoles;
      const { display: label, uuid: value } = userRole;
      // editing an account through Legacy UI results in 'null' string being added to 'locationUuid' user property
      const fixedLocationUuidString = locationUuidString?.replace(/null/g, "");
      const locationUuids = !!fixedLocationUuidString
        ? fixedLocationUuidString
            .split(",")
            .map((locationUuid) => locations.find(({ uuid }) => locationUuid === uuid))
            .filter(Boolean)
        : [];

      setUserAccount({
        familyName: { ...userAccount.familyName, value: familyName },
        givenName: { ...userAccount.givenName, value: givenName },
        phone: {
          ...userAccount.phone,
          value: attributes.find(({ attributeType }) => attributeType.uuid === telephoneNumberAtributeTypeUuid)?.value,
        },
        email: {
          ...userAccount.email,
          value: attributes.find(({ attributeType }) => attributeType.uuid === emailAddressAtributeTypeUuid)?.value,
        },
        username: { ...userAccount.username, value: username },
        locations: {
          ...userAccount.locations,
          value: locationUuids.map((option) => ({ label: option?.display, value: option?.uuid })),
        },
        userRole: { ...userAccount.userRole, value: { label, value } },
        password: { ...userAccount.password, value: DEFAULT_EDIT_USER_PASSWORD },
        confirmPassword: { ...userAccount.confirmPassword, value: DEFAULT_EDIT_USER_PASSWORD },
      });
      setForcePassword(false);
      getProviders(userUuid);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person, currentUser]);

  const validateEmptyFields = () => {
    const validatedUserAccount: IUserAccount = _.cloneDeep(userAccount);

    Object.keys(validatedUserAccount).forEach((fieldName) => {
      const field = validatedUserAccount[fieldName];
      if (
        field.isValid &&
        (!field.value ||
          (fieldName === LOCATION_FIELD && !field.value.length) ||
          (fieldName === USER_ROLE_FIELD && !field.value?.value))
      ) {
        field.isValid = false;
        field.error = "common.error.required";
      }
    });

    setUserAccount(validatedUserAccount);
  };

  const onValueChange = (name: string) => (event: FormEvent) => {
    const fieldValue = extractEventValue(event) || EMPTY_STRING;

    let isFieldValid = true;
    let errorMessage = "";

    switch (name) {
      case PHONE_FIELD:
        if (!isPossiblePhoneNumber(fieldValue)) {
          isFieldValid = false;
          errorMessage = "registerPatient.invalidPhoneNumber";
        }
        break;
      case EMAIL_FIELD:
        if (!EMAIL_REGEX.test(fieldValue)) {
          isFieldValid = false;
          errorMessage = "common.error.invalidEmail";
        }
        break;
      case USERNAME_FIELD:
        const isUsernameValid = fieldValue && USERNAME_REGEX.test(fieldValue);
        const otherUsers = users.filter(({ uuid }) => uuid !== currentUser.uuid);
        const isUsernameUnique = otherUsers.every(({ display }) => display.toLowerCase() !== fieldValue.toLowerCase());
        if (!isUsernameValid) {
          isFieldValid = false;
          errorMessage = "common.error.nameInvalid";
        } else if (!isUsernameUnique) {
          isFieldValid = false;
          errorMessage = "common.error.nameUnique";
        } else {
          // Do nothing
        }
        break;
      case PASSWORD_FIELD:
        const isPasswordValid = fieldValue && PASSWORD_REGEX.test(fieldValue);
        if (!isPasswordValid) {
          isFieldValid = false;
          errorMessage = "common.error.invalidPassword";
        }
        person && !forcePassword && setForcePassword(true);
        break;
      case CONFIRM_PASSWORD_FIELD:
        if (userAccount.password.value !== fieldValue) {
          isFieldValid = false;
          errorMessage = "common.error.confirmPassword";
        }
        break;
      default:
        break;
    }

    setUserAccount({
      ...userAccount,
      [name]: { ...userAccount[name], value: fieldValue, isValid: isFieldValid, error: errorMessage },
    });
    setDirtyFields(uniq([...dirtyFields, name]));
  };

  const onReturn = () => (window.location.href = `${ROOT_URL}adminui/systemadmin/accounts/manageAccounts.page`);

  const onSave = () => {
    validateEmptyFields();
    const isFormValid = Object.values(userAccount).every(
      ({ value, isValid }) => (value?.length || value?.value) && isValid,
    );

    if (isFormValid) {
      const isPasswordFieldDirty = dirtyFields.find((field) => field === PASSWORD_FIELD);
      const personAttributes = [];
      telephoneNumberAtributeTypeUuid &&
        personAttributes.push({
          attributeType: telephoneNumberAtributeTypeUuid,
          value: userAccount.phone.value,
        });
      emailAddressAtributeTypeUuid &&
        personAttributes.push({
          attributeType: emailAddressAtributeTypeUuid,
          value: userAccount.email.value,
        });

      saveUser(
        {
          username: userAccount.username.value,
          ...(!person && isPasswordFieldDirty && { password: userAccount.password.value }),
          userProperties: {
            forcePassword: String(forcePassword),
            locationUuid: userAccount?.locations.value.map(({ value }) => value).join(","),
          },
          roles: [
            {
              uuid: userAccount?.userRole.value?.value,
              name: userAccount?.userRole.value?.label,
            },
          ],
          person: {
            uuid: person?.uuid,
            gender: person?.gender || GENDER_OTHER,
            attributes: personAttributes,
            names: [
              {
                uuid: person?.preferredName?.uuid,
                givenName: userAccount.givenName.value,
                familyName: userAccount.familyName.value,
              },
            ],
          },
        },
        userUuid,
        person && isPasswordFieldDirty && userAccount.password.value,
      );
    } else {
      errorToast(intl.formatMessage({ id: "userAccount.accountNotSaved" }));
    }
  };

  const onDelete = () => setIsConfirmationModalOpen(true);

  const confirmationModal = () => (
    <ConfirmationModal
      header={{ id: "userAccount.deleteAccount.confirmationModal.header" }}
      body={{ id: "userAccount.deleteAccount.confirmationModal.body" }}
      onYes={() => {
        deleteProvider(provider.uuid);
        deleteUser(currentUser.uuid);
        setIsConfirmationModalOpen(false);
      }}
      onNo={() => setIsConfirmationModalOpen(false)}
      isOpen={isConfirmationModalOpen}
    />
  );

  return (
    <div id="user-account" className={cx({ edit: personId })}>
      {confirmationModal()}
      <FormattedMessage id={`userAccount.${!personId ? "add" : "edit"}`} tagName="h2" />
      {userLoading || loadingSettings ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          {personId && (
            <div className="d-inline pull-right">
              <Button className="delete" onClick={onDelete} data-testid="deleteAccount">
                <FormattedMessage id="userAccount.deleteAccount.label" />
              </Button>
            </div>
          )}
          <Form className={cx({ hide: userLoading })}>
            <div className="section person">
              <PersonDetails intl={intl} onValueChange={onValueChange} userAccount={userAccount} />
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
                userAccount={userAccount}
                dirtyFields={dirtyFields}
                locations={locations}
                roles={roles}
                setForcePassword={setForcePassword}
                forcePassword={forcePassword}
                isEdit={!!person}
                roleUuidsToHide={roleUuidsToHide}
              />
            </div>
            <div className="buttons mt-5 pb-5">
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
          </Form>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({
  role: { roles },
  location: { locations },
  user: {
    loading,
    users,
    providers,
    currentUser,
    updatedUser,
    success: {
      createUser: successCreateUser,
      createProvider: successCreateProvider,
      deleteUser: successDeleteUser,
      deleteProvider: successDeleteProvider,
    },
  },
  settings: { settings, loading: loadingSettings, setting },
  cflPerson: { person },
}: IStore) => ({
  userLoading: !personId ? loading : isNil(person),
  locations,
  roles,
  users,
  provider: providers.find(({ person: { uuid } }) => uuid === currentUser?.person?.uuid),
  currentUser,
  settings,
  loadingSettings,
  setting,
  person,
  updatedUser,
  successCreateUser,
  successCreateProvider,
  successDeleteUser,
  successDeleteProvider,
});

const mapDispatchToProps = {
  searchLocations,
  getRoles,
  getUsers,
  getProviders,
  getUserByPersonId,
  getSettings,
  getSettingByQuery,
  getPerson,
  saveUser,
  saveProvider,
  deleteUser,
  deleteProvider,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(UserAccount)));
