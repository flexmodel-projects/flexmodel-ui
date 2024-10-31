import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";

const initState = {
  locale: localStorage.getItem("i18nextLng") === "zh" ? zhCN : enUS,
}

const langReducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.payload,
      };
    default:
      return state;
  }
}

export default langReducer;
