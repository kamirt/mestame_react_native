import React from 'react'
import StyleSheet from 'react-native-rem-stylesheet'
import {
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native'
import { Text, ListItem, Rating, Button } from 'react-native-elements'

import { connect } from 'react-redux'

import Colors, { baseColor } from '../constants/Colors'

import Icon from '../components/utils/Icon'
import PlacesMap from '../components/main/PlacesMap'
import DividedView from '../components/main/swipeable/DividedView'
import ExpandCollapse from '../components/animation/ExpandCollapse'

import _ from 'lodash'

import months from '../constants/months'

import posed from 'react-native-pose'
import Carousel from '../components/place/Carousel'

class PlaceScreen extends React.Component {
  static navigationOptions =({ navigation }) => {
    const placeName = navigation.state.params.name
    return {
      title: placeName || 'Неизвестное событие',
    }
  };

  state = {
    region: null,
    isButtonLoading: false
  }

  componentDidMount() {
    // место, к которому перешли
    const place = this.props.navigation.state.params.place
    this.props.dispatch({
      type: 'GET_PLACE_DETAILS',
      payload: { id: place }
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log(nextProps.currentPlace)
    if (nextProps.currentPlace) {
      const points = nextProps.currentPlace.ppoint_set
      if (!points) return
      const pointLocs = points.map((p) => ({
        lat: p.location[1],
        lng: p.location[0]
      }))
      const minLat = _.minBy(pointLocs, 'lat').lat
      const maxLat = _.maxBy(pointLocs, 'lat').lat
      const minLng = _.minBy(pointLocs, 'lng').lng
      const maxLng = _.maxBy(pointLocs, 'lng').lng
      const region = {
        latitude: minLat + ((maxLat - minLat) / 2),
        longitude: minLng + ((maxLng - minLng) / 2),
        latitudeDelta: (maxLat - minLat) + 0.3, // 0.3 - для отступов
        longitudeDelta: (maxLng - minLng) + 0.3
      }
      console.log('REGION==================', region)
      this.setState({ region: region })
    }
  }

  //methods

  renderRouteDesc (route) {
    // const route = this.props.currentPlace.ppoint_set
    // expand-collapse route items
    const onItemPress = (index, event) => {
      if (index === this.state.expandedRouteItem || !route[index].description) {
        this.setState({ expandedRouteItem: null })
        return
      }
      this.setState({ expandedRouteItem: index })
    }

    const isFirstOrLast = (i, length) => {
      return i === 0 || i === length - 1 ? true : false
    }

    const chevronProps = (i) => ({
      name: 'flag-checkered',
      type: 'material-community',
      iconStyle: { paddingLeft: 0, marginLeft: 0 }
    })

    if (route) {
      return route.map((item, i) => {
        return (
          <View key={i} style={this.state.expandedRouteItem === i ? styles.routeItemWrapper : {}}>
            <ListItem
              Component={TouchableOpacity}
              style={styles.routeItem}
              titleStyle={{fontWeight: 'bold'}}
              chevron={this.state.expandedRouteItem !== i}
              leftIcon={ isFirstOrLast(i, route.length) ? chevronProps(i) : null }
              leftElement={ !isFirstOrLast(i, route.length) ? (<Text style={styles.routePoints}>{`${i + 1}.`}</Text>) : null }
              title={item.name}
              onPress={(e) => { onItemPress(i, e) }}
            />
            <ExpandCollapse
              expanded={ this.state.expandedRouteItem === i }
              style={{ paddingLeft: 20, backgroundColor: '#ffffff' }}>
              <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 20 }}>
                <View style={{ backgroundColor: 'red', width: 2, marginRight: 10 }} />
                <View>
                  <Text>{ item.description }</Text>
                </View>
              </View>
            </ExpandCollapse>
          </View>
          )
      })
    }
    return null
  }

  onFinishRating () {
    //
  }
  render() {

    const getRoutePath = (ppoints) => {
      if (!ppoints) return
      const withoutSearchPoint = ppoints.filter((point) => (!point.for_search))
      return _.sortBy(withoutSearchPoint, ['order']).map((point, index, arr) => {
        switch (index) {
          case 0:
            return {
              ...point,
              marker: { name: 'home-map-marker', type: 'MaterialCommunityIcons' }
            }
          case arr.length -1:
            return {
              ...point,
              marker: { name: 'map-marker-radius', type: 'MaterialCommunityIcons' }
            }
          default:
            return {
              ...point,
              marker: { name: 'map-marker', type: 'MaterialCommunityIcons' }
            }
        }
      })
    }
    const getRouteLine = (route) => {
      if (Array.isArray(route) && route.length > 0) {
        return route[0].route
      }
    }

    const getDate = (jsonDate) => {
      console.log('DATE >>>>>>', jsonDate, new Date(jsonDate))
      let date = new Date(jsonDate)
      let day = date.getDate().toString().length < 2 ? '0' + date.getDate() : date.getDate()
      let month = months[date.getMonth()]
      let year = date.getFullYear()
      let strDate = `${day}.${month}.${year}`
      return strDate
    }

    const getAreaMode = (area) => {
      const swipe = this.state.lastSwipe
      if (!swipe || swipe === 'left' || swipe === 'right') return null

      const modes = {
        up: { top: 'topsmall', bottom: 'bottomfull' },
        down: { top: 'topfull', bottom: 'bottomsmall' }
      }
      const mode =  this.state.areaCollapsed ? 'half': modes[swipe][area]

      return mode
    }

    return (
      <DividedView>
        {this.props.currentPlace && <PlacesMap
          mode = { 'readonly' }
          places = { getRoutePath(this.props.currentPlace.ppoint_set) }
          placeRoute={ getRouteLine(this.props.currentPlace.route) }
          hideUser={true}
          region={ this.state.region }
        />}
        <View>
          { this.props.currentPlace && <View style={styles.toolContainer}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Likes', { place: this.props.currentPlace.id }) }}>
              <Icon
                name={ 'heart' }
                badge={1}
                color={ this.props.currentPlace.likes ? 'red' : null  }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Comments', { place: this.props.currentPlace.id }) }}>
              <Icon
                name={ 'comment' }
                badge={1}
                color={ null }
              />
            </TouchableOpacity>
            <Rating
              ratingCount={5}
              imageSize={20}
              fractions={0}
              ratingColor={'#f1c40f'}
              onFinishRating={this.ratingCompleted}
              startingValue={5}
            />
          </View> }
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {this.props.currentPlace && <View style={styles.getStartedContainer}>
              <View style={styles.placeCredentials}>
                <View>
                  <Text>{this.props.currentPlace.author.full_name}</Text>
                  <Text>{getDate(this.props.currentPlace.date_start)}</Text>
                </View>
                <View>
                  <Text>{this.props.navigation.state.params.place.distance + ' км'}</Text>
                  <Text>{this.props.currentPlace.max_participants + '/' + this.props.currentPlace.max_participants}</Text>
                </View>
              </View>
              <Carousel items={this.props.currentPlace.images} />
              {this.renderRouteDesc(getRoutePath(this.props.currentPlace.ppoint_set))}
              <View style={styles.placeText}>
                {/* DESCRIPTION */}
                <Text>{this.props.currentPlace.description}</Text>
              </View>
            </View>}
            <View style={styles.buttonWrapper}>
              <Button
                title={'Участвовать'}
                raised
                loading={this.state.isButtonLoading}
                onPress={this.letsParticipate.bind(this)}
              />
            </View>
          </ScrollView>
        </View>
      </DividedView>
    );
  }

  letsParticipate () {
    this.setState({isButtonLoading: true})
  }

  _maybeRenderDevelopmentModeWarning() {
    return (<View></View>)
    // if (__DEV__) {
    //   const learnMoreButton = (
    //     <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
    //       Learn more
    //     </Text>
    //   );
    //
    //   return (
    //     <Text style={styles.developmentModeText}>
    //       Development mode is enabled, your app will be slower but you can use useful development
    //       tools. {learnMoreButton}
    //     </Text>
    //   );
    // } else {
    //   return (
    //     <Text style={styles.developmentModeText}>
    //       You are not in development mode, your app will run at full speed.
    //     </Text>
    //   );
    // }
  }

  onRegionChange () {
    //console.log('regionChange')
  }

  getPlacesList () {
    let userLocation = [
      this.state.userLocation.coords.latitude,
      this.state.userLocation.coords.longitude
    ]
    console.log('USER LOCATION', userLocation)
  }
}

const styles = StyleSheet.create({
  mapWrapper: {
    width: 320,
    backgroundColor: '#e7e7e7',
    height: 300 // total 520
  },
  newsWrapper: {
    elevation: 2,
    height: 150
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    marginVertical: 5,
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    paddingLeft: 20
  },
  getStartedContainer: {
    padding: 10
  },
  routeItem: {
    flex: 1,
    paddingLeft: 0
  },
  routePoints: {
    fontSize: 14,
    paddingLeft: 5,
    fontWeight: 'bold'
  },
  routeItemWrapper: {
  },
  placeCredentials: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  toolContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.lightColor
  },
  placeText: {
    paddingTop: 15
  },
  buttonWrapper: {
    padding: 10,
    flexDirection: 'row'
  }
});

const mapStateToProps = state => ({
  placesLoaded: state.places.loaded,
  placesList: state.places.placesList,
  currentPlace: state.places.currentPlace
});

export default connect(mapStateToProps)(PlaceScreen);