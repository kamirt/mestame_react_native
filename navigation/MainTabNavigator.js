import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Image } from 'react-native'
import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/Home/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlaceScreen from '../screens/PlaceScreen';
import LikesScreen from '../screens/tools/LikesScreen'
import CommentsScreen from '../screens/tools/CommentsScreen'
import CreationScreen from "../screens/CreationScreen";

const tabBarOptions = {
  activeTintColor: Colors.tabIconSelected,
  inactiveTintColor: Colors.tabIconDefault
}

export const HomeStack = createStackNavigator({
  Home: HomeScreen,
  // Place: PlaceScreen,
  // Comments: {screen: CommentsScreen, navigationOptions: {
  //     headerBackImage: <Image source={require('../assets/images/cross.png')} style={{height: 24, width: 24}} />
  //   }},
  // Likes: {screen: LikesScreen, navigationOptions: {
  //     headerBackImage: <Image source={require('../assets/images/cross.png')} style={{height: 24, width: 24}} />
  //   }},
},
{
    mode: 'modal'
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Новости',
  tabBarOptions: tabBarOptions,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ 'newspaper' }
    />
  ),
  //headerMode: 'float'
};

const SearchStack = createStackNavigator({
  Search: LinksScreen,
  //headerMode: 'float'
});



SearchStack.navigationOptions = {
  tabBarLabel: 'История',
  tabBarOptions: tabBarOptions,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ 'map-search-outline' }
    />
  ),
  //headerMode: 'float'
};

const DialogStack = createStackNavigator({
  Dialog: ProfileScreen,
});

DialogStack.navigationOptions = {
  tabBarLabel: 'Сообщения',
  tabBarOptions: tabBarOptions,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ 'message-outline' }
    />
  ),
  //headerMode: 'float'
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  PlaceCreate: CreationScreen
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Профиль',
  tabBarOptions: tabBarOptions,
  tabBarIcon: ({ focused }) => (
      <TabBarIcon
          focused={focused}
          name={ 'account' }
      />
  ),
  //headerMode: 'float'
};


// dfgs
export default createBottomTabNavigator({
  HomeStack,
  // SearchStack,
  // DialogStack,
  // ProfileStack
});
