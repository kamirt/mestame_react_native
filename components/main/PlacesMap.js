import React from 'react'
import { View, Platform } from 'react-native'
import StyleSheet from 'react-native-rem-stylesheet'
import { UrlTile, Marker, Polyline } from 'react-native-maps'
import MapView from 'react-native-maps'
import Icon from '../utils/Icon'
import PropTypes from 'prop-types'

class PlacesMap extends React.Component {

  static propTypes = {
    hideUser: PropTypes.bool,
    places: PropTypes.array,
    placeRoute: PropTypes.array,
    region: PropTypes.object,
    mode: PropTypes.oneOf(['readonly', 'setmarker', 'setroute']),
    onMarkerPositionChange: PropTypes.func
  }

  state = {
    tileServerUrl: 'http://vec01.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU',
    region: null,
    draggableLocation: null
  }

  onRegionChange(e) {

  }

  componentDidMount() {
    console.log('PLACES-------------------------', this.props.places)
    if (this.props.userLocation) {
      this.setState({
        region: {
          latitude: this.props.userLocation.coords.latitude,
          longitude: this.props.userLocation.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04
        }
      })
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.userLocation) {
      this.setState({
        region: {
          latitude: nextProps.userLocation.coords.latitude,
          longitude: nextProps.userLocation.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04
        }
      })
    }
  }



  render() {

    const getCategoryIcon = (iconName) => {
      console.log('ICON NAME>>>>>>> ', iconName)
      return { name: iconName.split(',')[0], set: iconName.split(',')[1] }
      // return { name: 'arrow-right', set: 'MaterialCommunityIcons' }
    }

    return (
      <View style={styles.mainMap}>
        <MapView
          style={styles.mainMap}
          region={this.props.region || this.state.region}
          provider={null}
          mapType={Platform.OS == "android" ? "none" : "standard"}
          onRegionChange={this.onRegionChange.bind(this)}>
          <UrlTile
            // The patterns {x} {y} {z} will be replaced at runtime
            urlTemplate={this.state.tileServerUrl}
            maximumZ={19}
            flipY={false}/>
          {Array.isArray(this.props.places) && this.props.places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{latitude: place.location[1], longitude: place.location[0]}}
              //title={place.name}
              description={place.description} >
                {place.marker && <Icon
                  name={place.marker.name}
                  color={'black'}
                  setType={place.marker.type}
                  iconStyle={{ paddingLeft: 0, marginLeft: 0 }}
                />}
                {place.category && <Icon
                  name={ getCategoryIcon(place.category.icon).name }
                  color={'red'}
                  setType={ getCategoryIcon(place.category.icon).set }
                  iconStyle={{ paddingLeft: 0, marginLeft: 0 }}
                />}
            </Marker>
          ))}
          {
            this.props.mode === 'setmarker' && <Marker
              draggable
              key={'placeLocation'}
              onDragEnd={this._onMarkerDragEnd.bind(this)}
              coordinate={{
                latitude: this.props.userLocation.coords.latitude,
                longitude: this.props.userLocation.coords.longitude
              }}
            />
          }
          {this.props.userLocation && this.props.userLocation.coords && !this.props.hideUser && <Marker
            key={'myloc'}
            coordinate={{
              latitude: this.props.userLocation.coords.latitude,
              longitude: this.props.userLocation.coords.longitude
            }}
            title={'My location'}
            description={'Here I am'}>
            <Icon
              name={ 'human-handsup' }
              color={'black'}
              setType={ 'MaterialCommunityIcons' }
            />
          </Marker>}
          {Array.isArray(this.props.placeRoute) && <Polyline
            coordinates={this.props.placeRoute.map((el) => {
              return { latitude: el[1], longitude: el[0] }
            })}
            strokeColor='#2C5485'
            strokeWidth={3}
          />}
        </MapView>
      </View>
    )
  }

  _onMarkerDragEnd (e) {
    console.log(e)
    this.setState({ draggableLocation: e.nativeEvent.coordinate })
    if (this.props.onMarkerPositionChange) {
      this.props.onMarkerPositionChange(e)
    }
  }

}


const styles = StyleSheet.create({
  mainMap: {
    flex: 1
  }
});

export default PlacesMap