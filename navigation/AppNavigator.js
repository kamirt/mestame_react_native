import React from 'react'
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation'
import MainTabNavigator from './MainTabNavigator'
import AuthScreen from '../screens/authentication/AuthScreen'
import CheckAuthScreen from '../screens/authentication/CheckAuthScreen'
import EmailConfirmScreen from '../screens/authentication/EmailConfirmScreen'
import FillProfileScreen from '../screens/authentication/FillProfileScreen'

const AuthStack = createStackNavigator({ SignIn:
  {
    screen: AuthScreen,
  }
  }, {
  headerMode: 'none'
})

const EmailConfirm = createStackNavigator({ Confirm:
    {
      screen: EmailConfirmScreen,
    }
}, {
  headerMode: 'none'
})

const FillProfileStack = createStackNavigator({ FillProfile:
    {
      screen: FillProfileScreen,
    }
}, {
  headerMode: 'none'
})

export default createAppContainer(createSwitchNavigator({
  Main: MainTabNavigator,
  Auth: AuthStack,
  FillProfile: FillProfileStack,
  EmailConfirm: EmailConfirm,
  CheckAuth: CheckAuthScreen
},{
  initialRouteName: 'CheckAuth',
}));