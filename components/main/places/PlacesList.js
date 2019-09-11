import {
  Platform,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import {Text} from "react-native-elements";
import React from 'react';
import StyleSheet from 'react-native-rem-stylesheet';
import {flowRight as compose} from 'lodash';
import { withApollo } from 'react-apollo';

import months from "../../../constants/months";
import BaseStyles from '../../../constants/Styles';
import { getPlaces } from './graphql/queries'

class PlacesList extends React.Component {

  render() {

    const getDate = (jsonDate) => {
      let date = new Date(jsonDate)
      let day = date.getDate().toString().length < 2 ? '0' + date.getDate() : date.getDate()
      let month = months[date.getMonth()]
      let year = date.getFullYear()
      let strDate = `${day} ${month} ${year}`
      return strDate
    }

    const dataAvailable = () => {
      return this.props.data && !this.props.data.loading
        ? this.props.data.filteredPlaces
        : false
    }

    return (
      <View style={styles.cardContainer}>
        {dataAvailable() && dataAvailable().map((place, index) => (
          <TouchableOpacity
            onPress={this.props.handlePlaceTap.bind(place)}
            containerStyle={styles.card}
            key={'text' + index}
            style={styles.card}>
            <View style={{position: 'relative'}}>
              <Image style={styles.headerImg} source={require('../../../assets/images/pattern_90.png')}/>
              <Text style={{...BaseStyles.headerText, ...styles.headerText}}>{place.name}</Text>
            </View>
            <View style={styles.placeCredentials}>
              <View>
                {/*<Text style={BaseStyles.helpTextDark}>{place.author.full_name}</Text>*/}
                <Text style={BaseStyles.helpTextDark}>{getDate(place.date_start)}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={BaseStyles.helpTextDark}>{'До места сбора: ' + place.distance + ' км'}</Text>
                <Text style={BaseStyles.helpTextDark}>{'Участники: ' + place.min_participants + '/' + place.max_participants}</Text>
              </View>
            </View>
            <View style={styles.placeBody}>
              <Image style={styles.placePic} source={{uri: place.picture}}/>
              <Text style={BaseStyles.baseText}>{place.description}</Text>
            </View>
          </TouchableOpacity>))}
      </View>
    );
  }



}

const styles = StyleSheet.create({
  cardContainer: {
    width: 320,
    flex: 1
  },
  card: {
    width: 320,
    height: 200
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  scrollContainer: {
    // height: 120
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
  getPlaces
)(PlacesList);