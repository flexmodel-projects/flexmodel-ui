import {combineReducers} from "redux";
import langReducer from "./LangReducer.ts";

export const rootReducer = combineReducers({
  locale: langReducer,
});
