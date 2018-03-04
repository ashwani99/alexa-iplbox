import React, { Component } from "react";
import { BackHandler } from "react-native"
import Expo from "expo";
import Main from "./Main";
export default class AwesomeApp extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };

  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <Main />
    // return <MainScreen />

  }

}
