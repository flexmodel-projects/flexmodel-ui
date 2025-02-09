import {getSystemProfile} from "../api/system.ts";

export const setConfig = (config: any) => ({
  type: 'SET_CONFIG',
  payload: config,
});

export const fetchConfig = () => async (dispatch: any) => {
  const {config} = await getSystemProfile();
  dispatch(setConfig(config));
}
