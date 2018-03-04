let AuthData;
import isEmpty from "lodash/isEmpty";
import { AsyncStorage } from "react-native";

export const getAuthTocken = () => {
    try {
        return getAuth().auth_token;
    } catch (error) {
        return null;
    }
}

export const setAuth = (data) => {
    AuthData = data;
};

export const getAuth = () => {
    return AuthData;
};


export const getHeader = (noAuth = false, ...data) => {
    let authToken = getAuthTocken();
    let headerData = {
        credentials: 'include',
        "Content-Type": "application/json"
    };
    if (authToken !== null && !noAuth) {
        headerData["Authorization"] = "Bearer " + authToken;
        return headerData;
    } else {
        return headerData;
    }
}
