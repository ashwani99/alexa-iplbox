import { createStore, combineReducers, applyMiddleware } from "redux";
import { Auth } from "./../Resource";
import { createLogger } from "redux-logger";
import { authReducer } from "./../Reducers";
import thunk from "redux-thunk";
import { authActions } from "./../Actions";
import * as authHelper from "./authHelper";
import { AsyncStorage } from "react-native";
// import { routerReducer, routerMiddleware, push } from 'react-router-redux';
// import history from "./history";
// import queryString from "query-string";

const customMiddleWare = store => next => action => {
    if (action.type === "@@resource/AUTH/GET" && action.status === "resolved") {
        authHelper.setAuth(JSON.stringify(action.body));
        store.dispatch(authActions.authLogin(action.body));
    } else if (action.type === "@@resource/AUTH/SIGNUP" && action.status === "resolved") {
        store.dispatch(authActions.authPageSet("login"));
    }

    next(action);
}


// const middleware = routerMiddleware(history)

const logger = createLogger({ predicate: 'development' });

const store = createStore(
    combineReducers({ auth: Auth.rootReducer, userAuth: authReducer }),
    applyMiddleware(thunk, logger, customMiddleWare)
);

export default store;