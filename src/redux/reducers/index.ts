import { combineReducers } from "redux";
import patient from "./patient";
import person from "./person";

export default combineReducers({
  patient,
  person,
});
