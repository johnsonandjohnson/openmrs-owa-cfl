/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import { sagas as openmrsSagas } from '@openmrs/react-components';

const sagaMiddleware = createSagaMiddleware();

const defaultMiddlewares = [thunkMiddleware, promiseMiddleware, sagaMiddleware];

const composedMiddlewares = middlewares => compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

const initialize = (initialState?, middlewares = []) => {
  const store = createStore(rootReducer, initialState, composedMiddlewares(middlewares));
  sagaMiddleware.run(openmrsSagas);
  return store;
};

export default initialize;
