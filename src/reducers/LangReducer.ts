import zhCN from "antd/locale/zh_CN";

const initState = {
  locale: zhCN,
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
