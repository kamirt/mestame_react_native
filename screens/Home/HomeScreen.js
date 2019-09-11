import React from 'react'
import {flowRight as compose} from 'lodash'
import StyleSheet from 'react-native-rem-stylesheet'
import {
  Platform,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from 'react-native'
import { Text } from 'react-native-elements'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { withApollo } from 'react-apollo'
import Header from '../../components/main/Header'
import { baseColor } from '../../constants/Colors'
import DividedView from '../../components/main/swipeable/DividedView'
import PlacesMap from '../../components/main/PlacesMap'
import PlacesList from '../../components/main/places/PlacesList'
import months from "../../constants/months"

import { getUserLocation } from './graphql/queries'

class HomeScreen extends React.Component {

  static navigationOptions = {
    //headerStyle: {},
    headerTransparent: true,
    headerBackground: <Header />
  }

  componentDidMount () {
    this._accessLocation()
  }

  render() {
    return (
      <DividedView>
        {/*<PlacesMap mode = { 'readonly' }  places = {this.props.placesList} style={styles.mapWrapper}/>*/}
        <Text>{'Here will be the map'}</Text>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
          { this.props.data.userLocation &&
            <PlacesList
              handlePlaceTap={this.handlePlaceTap}
              userLocation={this.props.data.userLocation}/> }
        </ScrollView>
      </DividedView>
    );
  }

  /* methods */

  handlePlaceTap = (place, e) => {
    this.props.navigation.navigate('Place', { place: place.id, name: place.name });
  };

  _accessLocation = async () => {
    let access = await this._checkLocationAccess({ accuracy: Location.Accuracy.Balanced})
    if (!access) {
      return this._getLocationAccess()
    } else {
      return this._getUserLocation()
    }
  }

  _getLocationAccess = async () => {
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      return this._getUserLocation()
    } else {
      Alert.alert('Внимание', 'К сожалению, без данного разрешения приложение бесполезно')
      return this._getLocationAccess()
    }
  }

  _checkLocationAccess = async () => {
    let granted;
    if (Platform.OS !== 'web') {
      granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
    }

    //const expoGranted = await Location.requestPermissionsAsync();
    //console.log('EXPO LOCATION GRANTED', expoGranted)
    if (granted) {
      console.log('LOCATION ACCESS GRANTED')
    } else {
      console.log('LOCATION NOT GRANTED')
    }
    return granted
  }

  _getUserLocation = async () => {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
    this.setState({ userLocation: location })

    if (location.coords) {
      this.props.client.writeData({
        data: {
          userLocation: JSON.stringify({latitude: location.coords.latitude, longitude: location.coords.longitude})
        }
      })
    }
  }

}



const styles = StyleSheet.create({
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  scrollContainer: {
    height: 120
  },
  contentContainer: {
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  placeCredentials: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  placeHeader: {
    color: '#2e78b7',
    textAlign: 'left',
    justifyContent: 'flex-start'
  },
  placeInfo: {
    color: '#969696',
    fontSize: 12,
  },
  placeBody: {
    paddingLeft: 10,
    paddingRight: 10
  },
  placePic: {
    width: 280,
    height: 200,
    resizeMode: 'cover'
  },
  placePhotoWrapper: {
    flexDirection: 'row'
  },
  placePhotoSmall: {
    width: 50,
    height: 50
  },
  headerImg: {
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    resizeMode: 'contain',
    width: 30,
    height: 54
  },
  headerText: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 10,
    // textTransform: 'uppercase',
    alignItems: 'flex-start',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  slide: {
    flex: 1,
    height: 200
  }
});

export default compose(
  withApollo,
  getUserLocation
)(HomeScreen);
