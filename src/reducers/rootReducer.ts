import { combineReducers } from "redux";
import { IState } from "../store/configStore.ts";
import { todos } from "./todosReducer.ts";

export const initState: IState = {
    todos: [],
};

export const rootReducer = combineReducers({
    todos,
});
