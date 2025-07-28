import {getDarkModeFromStorage} from "@/utils/darkMode.ts";

const initState = {
  isDark: getDarkModeFromStorage(),
}

const themeReducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return {
        ...state,
        isDark: action.payload,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        isDark: !state.isDark,
      };
    default:
      return state;
  }
}

export default themeReducer;
