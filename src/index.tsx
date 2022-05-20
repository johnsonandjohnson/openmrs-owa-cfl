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
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import initStore from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IntlProvider } from 'react-intl';
import en from './lang/en.json';
import flatten from 'flat';

const store = initStore();
const messages = flatten(en);
const locale = 'en';

// @ts-ignore
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <App />
      </IntlProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
