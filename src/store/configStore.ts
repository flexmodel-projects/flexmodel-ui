import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from "../reducers/rootReducer";

const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppDispatch = typeof store.dispatch; // 用于定义 dispatch 类型
export type RootState = ReturnType<typeof rootReducer>; // 用于获得根状态类型

export default store;
