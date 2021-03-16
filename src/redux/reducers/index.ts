import { combineReducers } from "redux";
import patient from "./patient";
import person from "./person";
import cflPeople from "./cfl-people";

export default combineReducers({
  patient,
  person,
  cflPeople,
});
