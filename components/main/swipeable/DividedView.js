import React from 'react'
import StyleSheet from 'react-native-rem-stylesheet'
import {
  View,
  Dimensions
} from 'react-native'
import Swipeable from './Swipeable'
import Header from '../Header'

class DividedView extends React.Component {

  constructor (props) {
    super(props)
    if (this.props.children.length > 2) {
      console.error(`Divided View can only contains 2 children, but found ${this.props.children.length}`)
    }
  }

  state = {
    initialWallHeight: Dimensions.get('window').height / 2,
    swipeOffset: 0,
    lastSwipe: null
  }

  onSwipeOnce = (event) => {
    const direction = event.direction
    let stateObj = { lastSwipe: direction }
    if (direction === 'up' || direction === 'down') stateObj.areaCollapsed = !this.state.areaCollapsed
    this.setState(stateObj)
  }

  onSwipeableTap = () => {
    console.log('TAAAAAAAAAAAAP')
    const direction = this.state.lastSwipe === 'up' ? 'down' : 'up'
    console.log(direction)
    this.setState({ lastSwipe: direction })
  }

  onWallSwipe = (opts) => {
    const offset = opts.y
    const windowHeight = Dimensions.get('window').height
    if (windowHeight / 2 - offset > windowHeight - Header.getHeight().fullHeight) return
    this.setState({ swipeOffset: offset })
  }

  onSwipeStop = () => {
    const { initialWallHeight, swipeOffset } = this.state;
    const newHeight = initialWallHeight - swipeOffset;
    const windowHeight = Dimensions.get('window').height
    const headerHeight = Header.getHeight().fullHeight
    const availableHeight = windowHeight - headerHeight - 50// bottomNavigator
    console.log('AVAILABLE HEIGHT', availableHeight)
    console.log('NEW HEIGHT', newHeight)
    if (newHeight > availableHeight) {
      this.setState({ initialWallHeight: availableHeight, swipeOffset: 0 })
      return
    }

    this.setState({ initialWallHeight: initialWallHeight - swipeOffset, swipeOffset: 0 })
  }
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   // обновляем анимацию шторки с шагом в 10 пунктов высоты
  //   if (nextState.initialWallHeight - nextState.swipeOffset % 10 !== 0) return false
  //   return true
  // }

  render() {

    const wallHeight = () => {
      const { initialWallHeight, swipeOffset } = this.state
      let h = initialWallHeight - swipeOffset;
      return h > 50 ? h : 50
    }

    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          { this.props.children[0] }
        </View>
        <View style={{ ...styles.bottomWrapper, ...{ height: wallHeight() } }}>
          <Swipeable
            arrow={this.state.lastSwipe}
            onSwipeStop = {this.onSwipeStop}
            onSwipe={this.onWallSwipe}
            tap={ this.onSwipeableTap } />
            { this.props.children[1] }
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative'
  },
  topWrapper: {
    flex: 1,
    zIndex: 0,
    marginTop: Header.getHeight().fullHeight
  },
  bottomWrapper: {
    position: 'absolute',
    width: 320,
    bottom: 0,
    backgroundColor: '#fff'
  }
});

export default DividedView;