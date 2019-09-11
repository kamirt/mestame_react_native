import React from 'react';
import {
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  AsyncStorage
} from 'react-native';
import { AppLoading } from 'expo';

import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import AppNavigator from './navigation/AppNavigator';

// import store from './store/index'
import { ThemeProvider } from 'react-native-elements';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import checkAuth from './checkAuth'
import { defaults, resolvers } from './graphql/local';

const theme = {}

export default class App extends React.Component {

  state = {
    isLoadingComplete: false,
    graphqlClient: null
  };



  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />)
    } else {
      return (
        <ThemeProvider theme={theme}>
          <StatusBar hidden={false} barStyle={'dark-content'} translucent={false} animated={false} backgroundColor={'#000000'}/>
          <ApolloProvider client={this.state.graphqlClient}>
            <View style={styles.container}>
              <AppNavigator />
            </View>
          </ApolloProvider>
        </ThemeProvider>
      )
    }
  }

  createGraphQl = async () => {

    const authInfo = await checkAuth();
    const authToken = await AsyncStorage.getItem('authToken');

    AsyncStorage.setItem('userProfile', JSON.stringify(authInfo.profile));
    AsyncStorage.setItem('afterAuthRoute', authInfo.routeToContinue);
    AsyncStorage.setItem('csrf', authInfo.csrfCookie);


    const authLink = setContext(async (_, { ...headers }) => {

      const authToken = await AsyncStorage.getItem('authToken');
      const csrfCookie = await AsyncStorage.getItem('csrf');

      console.log('CSRF_TOKEN ===== ', csrfCookie)
      return {
        credentials: 'include',
        headers: {
          ...headers,
          'X-CSRFToken': csrfCookie,
          'Authorization': authToken ? `Token ${authToken}` : "",
        }
      }
    });

    const link = createHttpLink({
      uri: 'http://192.168.1.102:8000/testgraphql',
      credentials: 'include',
      headers: {
        'X-CSRFToken': authInfo.csrfCookie,
        'Authorization': `Token ${authToken}`
      }
    });

    const client = new ApolloClient({
      link: authLink.concat(link),
      cache: new InMemoryCache(),
      defaults,
      resolvers,
    });
    this.setState({graphqlClient: client})
    return client
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      await this.createGraphQl(),
      Asset.loadAsync([
        require('./assets/images/mestame.png')
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      })
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = (result) => {
    if (this.state.graphqlClient) {
      this.setState({ isLoadingComplete: true });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});