import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  AsyncStorage
} from 'react-native';

import tools from '../../store/tools'

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const afterAuthRoute = await AsyncStorage.getItem('afterAuthRoute');

    this.props.navigation.navigate(afterAuthRoute);
  };

  // крутилка на время всех проверок
  render() {
    return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="default" backgroundColor="#ecf0f1" />
        </View>
    );
  }
}
export default AuthLoadingScreen;