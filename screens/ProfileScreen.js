import React from 'react';
import Header from "../components/main/Header";
import Profile from '../components/main/Profile';

import { AsyncStorage, ActivityIndicator } from "react-native";

class ProfileScreen extends React.Component {

  static navigationOptions = {
    //headerStyle: {},
    headerTransparent: true,
    headerBackground: <Header/>,
    tabBarOptions: {
      style: {height: 1}
    },
    tabBarVisible: false
  }

  state = {
    localProfile: null
  }

  componentDidMount = async () => {
    // get profile
    const profile = await AsyncStorage.getItem('userProfile')
    this.setState({localProfile: profile})
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render () {
    const navParams = this.props.navigation.state.params
    const profile = navParams && navParams.profile
      ? this.props.navigation.state.params.profile
      : null

    const isMine = this.state.localProfile && this.state.localProfile.id === profile.id
    if (profile) {
      return (
        <Profile
          profile={profile} isMine={isMine} navigation={this.props.navigation} />
      )
    } else {
      return (<ActivityIndicator />)
    }

  }

}


export default ProfileScreen;