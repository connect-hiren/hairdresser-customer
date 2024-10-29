import {UserData} from '../ActionType';

const initialState = {
  userData: null,
  token: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UserData.SET_USER_DATA:
      return {
        ...state,
        userData: action.payload.userData,
      };

    case UserData.SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };
    case UserData.LOG_OUT:
      return {
        ...state,
        userData: null,
        token: null,
      };
    default:
      return state;
  }
}
