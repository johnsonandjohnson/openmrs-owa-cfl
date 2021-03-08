import { createStore, applyMiddleware, compose } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

const defaultMiddlewares = [thunkMiddleware, promiseMiddleware];

const composedMiddlewares = (middlewares) =>
  compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

const initialize = (initialState?, middlewares = []) =>
  createStore(rootReducer, initialState, composedMiddlewares(middlewares));

export default initialize;
