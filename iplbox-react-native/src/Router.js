import React, { Component } from "react";
import { View } from "react-native";
import Login_Signup from "./Views/Login_Signup";
import MainScreen from "./Views/MainScreen";
import { connect } from "react-redux";

class Main extends Component {
    render() {
        console.log();
        if (!this.props.authLogin)
            return (<Login_Signup />);
        else
            return (<MainScreen />);
    }
}

const mapStateToProps = (state) => {
    let { authLogin } = state.userAuth;
    return { authLogin };
}

export default connect(mapStateToProps)(Main);