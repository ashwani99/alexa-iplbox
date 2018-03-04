import React, { Component } from "react";
import { View } from "react-native";
import Router from "./src/Router";
import { store, history } from "./src/Helper";
import { Provider } from "react-redux";
import { defaultGlobals as reduxRestResourceGlobals } from 'redux-rest-resource';
Object.assign(reduxRestResourceGlobals, { fetch });

export default class Main extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}