/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import './App.scss';
import Routes from './Routes';
import { connect } from 'react-redux';
import { getSession } from '../redux/reducers/session';
import { TinyButton as ScrollUpButton } from 'react-scroll-up-button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-3/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../assets/css/font-awesome-3.0.2.min.css';
import { getApps } from '../redux/reducers/apps';
import '@openmrs/style-referenceapplication/lib/referenceapplication.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PROJECT_LOCATION_ATTRIBUTE_TYPE_NAME } from 'src/shared/constants/app';
import { IntlProvider } from "react-intl";
import { merge } from 'lodash';
import flatten from 'flat';
import messagesEN from '../lang/en.json'
import messagesFR from '../lang/fr.json'
import messagesPTBR from '../lang/pt_BR.json'

toast.configure();

export interface IAppProps extends StateProps, DispatchProps {
}

class App extends React.Component<IAppProps> {
  defaultLocale = 'en';
  localeMessages = {
    en: flatten(messagesEN),
    fr: flatten(messagesFR),
    'pt-BR': flatten(messagesPTBR)
  };

  componentDidMount() {
    this.props.getSession();
  }

  componentDidUpdate(prevProps) {
    const projectName = this.getProjectName();
    const currentLocationUuid = this.props.session?.sessionLocation?.uuid;
    const previousLocationUuid = prevProps.session?.sessionLocation?.uuid;
    if (currentLocationUuid && previousLocationUuid !== currentLocationUuid) {
      this.props.getApps(projectName);
    }
  }

  getProjectName() {
    const projectNameObject = this.props.userLocation.attributes?.filter(attr => attr.display.startsWith(PROJECT_LOCATION_ATTRIBUTE_TYPE_NAME));
    let projectName = null;
    if (projectNameObject.length) {
      const displayText = projectNameObject[0].display;
      projectName = displayText.substring(displayText.indexOf(':') + 1).trim();
    }

    return projectName;
  }

  // Translation fallback:
  // locale -> locale without region codes -> default locale without region codes
  getMessagesForLocale = (locale) => {
    const localeWithoutRegionCode = this.getLocaleWithoutRegionCode(locale);
    const defaultLocaleWithoutRegionCode = this.getLocaleWithoutRegionCode(this.defaultLocale);
    return merge({}, this.localeMessages[defaultLocaleWithoutRegionCode], this.localeMessages[localeWithoutRegionCode], this.localeMessages[locale]);
  };

  getLocaleWithoutRegionCode = (locale) => {
    const regionCodeSeparatorRegex = /[_-]+/;
    return locale.toLowerCase().split(regionCodeSeparatorRegex)[0];
  };

  render() {
    const locale = this.props.locale ? this.props.locale : this.defaultLocale;
    const messages = this.getMessagesForLocale(locale);

    return (
      <IntlProvider locale={locale} messages={messages}>
        <div id="app" className="app">
          <Routes/>
          <ScrollUpButton/>
        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = ({session}) => ({
  session: session.session,
  userLocation: session.session?.sessionLocation,
  locale: session.session?.locale.replace("_", "-")
});

const mapDispatchToProps = {getSession, getApps};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);
