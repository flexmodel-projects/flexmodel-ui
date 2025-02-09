const initState = {
  config: {},
}

const configReducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'SET_CONFIG':
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
}

export default configReducer;
