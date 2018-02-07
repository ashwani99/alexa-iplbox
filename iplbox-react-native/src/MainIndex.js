import React, {Component} from 'react';
import {View,Text} from 'react-native';
import {StackNavigator} from 'react-navigation';

import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import MainScreen from './MainScreen';

const StackRouter = StackNavigator({
    ScreenOne: {
        screen: Screen1,
    },
    ScreenTwo: {
        screen: Screen2,
    },
    ScreenThree: {
        screen: Screen3,
    },
    ScreenMain: {
        screen: MainScreen,
    },
  },
    {
        headerMode: "none"
    },
    {
        initialRouteName: 'ScreenMain',
      }
  )
  
  
export default StackRouter;