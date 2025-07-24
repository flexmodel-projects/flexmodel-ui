import {getSystemProfile} from "../services/system.ts";

export const setConfig = (config: any) => ({
  type: 'SET_CONFIG',
  payload: config,
});

export const fetchConfig = () => async (dispatch: any) => {
  const profile = await getSystemProfile();
  dispatch(setConfig(profile.settings));
}
