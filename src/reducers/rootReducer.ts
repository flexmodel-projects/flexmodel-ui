import {combineReducers} from "redux";
import langReducer from "./langReducer.ts";
import configReducer from "./configReducer.ts";
import themeReducer from "./themeReducer.ts";

export const rootReducer = combineReducers({
  locale: langReducer,
  config: configReducer,
  theme: themeReducer,
});
