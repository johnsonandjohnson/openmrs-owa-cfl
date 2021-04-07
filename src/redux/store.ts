import { applyMiddleware, compose, createStore } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { sagas as openmrsSagas } from "@openmrs/react-components";

const sagaMiddleware = createSagaMiddleware();

const defaultMiddlewares = [thunkMiddleware, promiseMiddleware, sagaMiddleware];

const composedMiddlewares = (middlewares) =>
  compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

const initialize = (initialState?, middlewares = []) => {
  const store = createStore(
    rootReducer,
    initialState,
    composedMiddlewares(middlewares)
  );
  sagaMiddleware.run(openmrsSagas);
  return store;
};

export default initialize;
