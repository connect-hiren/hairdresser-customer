import { UserData } from '../ActionType';

export const setUserData = (userData) => {
    console.log(userData,"userDatauserData");
    return {
        type: UserData.SET_USER_DATA,
        payload: {
            userData
        }
    }
};

export const setToken = (token) => {
    console.log(token,"tokentoken");
    return {
        type: UserData.SET_TOKEN,
        payload: {
            token
        }
    }
};

export const logout = () => {
    return {
        type: UserData.LOG_OUT,
        payload: {}
    }
};