import React from 'react'
import {TextInput, View, Alert} from 'react-native'

export default class SimpleInput extends React.Component {
  constructor (props) {
    super(props)
  }
  state = {
    styles: {
      borderColor: '#eeeeee',
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      paddingLeft: 20
    }
  }
  render () {
    return (
      <View>
        <TextInput
            {...this.props}
            ref="self"
            style={[this.state.styles, this.props.style]}
            clearButtonMode={'while-editing'}
            placeholderTextColor={'#c1c1c1'}
            ></TextInput>
      </View>
    )
  }
  focus () {
    this.refs.self.focus()
  }
}