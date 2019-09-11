import React from 'react';
import { Animated, Text, View } from 'react-native';

export default class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    this._animate(1, 500)// Starts the animation
  }
  componentDidUpdate() {
    if (this.props.fade) {
      this._animate(1, 500)
      return
    }
    this._animate(0, 300)
  }
  render() {
    let { fadeAnim } = this.state;

    return (
        <Animated.View
            style={{
              ...this.props.style,
              opacity: fadeAnim,
            }}
        >
          {this.props.children}
        </Animated.View>
    );
  }

  _animate (value, duration) {
    Animated.timing(
        this.state.fadeAnim,
        {
          toValue: value,
          duration: duration,
        }
    ).start()
  }
}