import React from 'react'
import { View, PanResponder } from 'react-native'
import Icon from '../../utils/Icon'

export default class Swipeable extends React.Component {

    constructor (props) {
        super(props)
        const {
            offset
        } = this.props.config || {
            offset: 30
        }
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onShouldBlockNativeResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                if (!this.state.moving) {
                    this.setState({ moving: true })
                }
                // console.log(gestureState)
                const x = gestureState.dx
                const y = gestureState.dy
                this.setState({ x: x, y: y })
                this._onSwipe(x, y)
            },

            onPanResponderRelease: (evt, gestureState) => {
                this.setState({ moving: false })
                let event = {};
                const absX = Math.abs(this.state.x)
                const absY = Math.abs(this.state.y)
                const vertical =  absX < absY;
                this._onSwipeStop()
                if (vertical) {
                    event.direction = this.state.y > 0 ? 'down' : 'up'
                    event.offset = this.state.y
                    if (absY >= offset) {
                        this._onSwipeOnce(event)
                        return
                    }
                    return
                }
                event.direction = this.state.x > 0 ? 'right' : 'left'
                event.offset = this.state.x
                if (absX >= offset) {
                    this._onSwipeOnce(event)
                    return
                }
            }
        })
    }

    state = {
        moving: false,
        x: 0,
        y: 0,
        up: false,
        down: false,
        left: false,
        right: false
    }

    _onTap () {
        if (this.props.tap) this.props.tap()
    }

    _onSwipe (x, y) {
        if (x === 0 && y === 0) {
            this._onTap()
        }
        if (this.props.onSwipe) this.props.onSwipe({ x, y })
    }

    _onSwipeStop () {
        if (this.state.x === 0 && this.state.y === 0) {
            this._onTap()
        }
        if (this.props.onSwipeStop) this.props.onSwipeStop({ x: this.state.x, y: this.state.y })
    }

    _onSwipeOnce (e) {
        if (this.props.onSwipeOnce) this.props.onSwipeOnce(e)
    }

    render () {

        const getArrow = () => (
            this.props.arrow === 'up' ? 'arrow-up' : 'arrow-down'
        )
        const obj = { style: {
                height: 35,
                borderTopWidth: 1,
                borderColor: '#d8d8d8',
                alignItems: 'center'
            } }
        return (
                <View { ...this._panResponder.panHandlers } { ...obj }>
                    <Icon
                      name={'arrow-up'}
                      setType={'SimpleLineIcons'}
                      color={'#517fa4'}
                      size={15}
                    />
                    <Icon
                      name={'arrow-down'}
                      setType={'SimpleLineIcons'}
                      color={'#517fa4'}
                      size={15}
                    />
                    {this.props.children}
                </View>
            )
    }
}