import {configureStore, createSlice, current} from '@reduxjs/toolkit';

export default function moox(models) {
  const slices = {};
  const reducers = {};

  Object.keys(models).forEach((key) => {
    const model = models[key];
    const { state: initialState, ...handlers } = model;

    const rtkReducers = {};
    Object.keys(handlers).forEach((actionName) => {
      const fn = handlers[actionName];
      rtkReducers[actionName] = (state, action) => {
        const oldState = current(state);
        fn(state, action.payload, oldState);
      };
    });

    const slice = createSlice({
      name: key,
      initialState,
      reducers: rtkReducers,
    });

    slices[key] = slice;
    reducers[key] = slice.reducer;
  });

  const store = configureStore({ reducer: reducers });

  const Model = {};
  Object.keys(slices).forEach((key) => {
    const slice = slices[key];
    Model[key] = {};
    Object.keys(slice.actions).forEach((actionKey) => {
      Model[key][actionKey] = (payload) =>
        store.dispatch(slice.actions[actionKey](payload));
    });
  });

  Model.getStore = () => store;
  return Model;
}


