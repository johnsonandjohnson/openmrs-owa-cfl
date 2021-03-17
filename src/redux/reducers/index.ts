import { combineReducers } from "redux";
import patient from "./patient";
import person from "./person";
import cflPeople from "./cfl-people";
import session from "./session";
import settings from "./setttings";

export default combineReducers({
  patient,
  person,
  cflPeople,
  session,
  settings,
});
