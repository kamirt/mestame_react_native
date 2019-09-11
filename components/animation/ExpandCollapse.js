import React from 'react';
import { Animated } from 'react-native';

export default class ExpandCollapse extends React.Component {
  state = {
    val: new Animated.Value(0),
    initial: null,
    showChildren: true
  }

  componentDidUpdate() {
    if (!this.state.initial) return
    if (this.props.expanded) {
      this._animate(this.state.initial, 300)
      return
    }
    this._animate(0, 300)
  }

  onLayout (event) {
    if (this.state.initial) return
    const height = event.nativeEvent.layout.height
    this.setState({val: new Animated.Value(0), initial: height, showChildren: false})
  }

  render() {
    let initValue = this.state.val;

    const getStyleObj = () => {
      return this.state.initial === null ? {
        ...this.props.style
      } : {
        ...this.props.style,
        height: initValue
      }
    }

    return (
      <Animated.View
        onLayout={this.onLayout.bind(this)}
        style={getStyleObj()}
      >
        {this.state.showChildren && this.props.children}
      </Animated.View>
    );
  }

  _animate (value, duration) {
    Animated.timing(
      this.state.val,
      {
        useNativeDriver: false,
        toValue: value,
        duration: duration
      }
    ).start((res) => {
      if (res.finished) {
        this.setState({showChildren: value > 0})
      }
    })
  }
}