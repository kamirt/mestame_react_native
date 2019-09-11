import {ActivityIndicator, View, TouchableOpacity, Modal, Dimensions } from "react-native";
import Icon from "../utils/Icon";
import Carousel from "react-native-snap-carousel";
import React from 'react';
import {Image} from "react-native-elements";
import PropTypes from 'prop-types'
import StyleSheet from 'react-native-rem-stylesheet'
import Colors from '../../constants/Colors'

const { width } = Dimensions.get('window')

export default class PlaceCarousel extends React.Component {
  // items<Array>

  render () {
    return (
      <View style={styles.carouselWrapper}>
        <TouchableOpacity
          style={{...styles.sideArrow, left: 0}}
          onPress={
            () => {
              this._carousel.snapToPrev()
            }
        }>
          <Icon name={'arrow-left'} />
        </TouchableOpacity>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.props.items}
          renderItem={this._renderItem}
          sliderWidth={width - styles.offsets.left * 2}
          itemWidth={250}
          loop={true}
          layout={'default'}
        />
        <TouchableOpacity
          style={{...styles.sideArrow, right: 0}}
          onPress={
            () => {
              this._carousel.snapToNext()
            }
        }>
          <Icon name={'arrow-right'} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderItem ({item, index}) {
    return (
      <View style={styles.slideInner}>
        <Image
          source={{ uri: item.uri }}
          style={styles.slide}
          PlaceholderContent={<ActivityIndicator />} />
      </View>
    );
  }

}

PlaceCarousel.propTypes = {
  items: PropTypes.array
}

const styles = StyleSheet.create({
  offsets: {
    left: 10
  },
  carouselWrapper: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.lightColor
  },
  slide: {
    width: 250,
    height: 200,
    resizeMode: 'contain'
  },
  slideInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  sideArrow: {
    zIndex: 10,
    top: 0,
    height: 200,
    position: 'absolute',
    width: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center'
  }
})