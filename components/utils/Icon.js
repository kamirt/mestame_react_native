import React from 'react';
import * as ExpoIcon from '@expo/vector-icons';
import { Badge } from 'react-native-elements'
import { View } from 'react-native'
import StyleSheet from 'react-native-rem-stylesheet'
import Colors from '../../constants/Colors';

export default class Icon extends React.Component {
  // badge<Number|String>
  // name<String>
  // color<String>
  // size<Number>
  // tap<Function>
  // setType<String>
  render() {

    const IconSet = ExpoIcon[this.props.setType] || ExpoIcon.MaterialCommunityIcons

    return (
      <View style={{ width: this.props.size || 26, height: this.props.size || 26 }}>
        <IconSet
          onPress={this.props.tap}
          name={this.props.name}
          size={this.props.size || 26}
          color={this.props.color || Colors.tabIconDefault}
        />
        {this.props.badge && <Badge
          status="primary"
          value={this.props.badge ? this.props.badge : null}
          containerStyle={{ position: 'absolute', top: -4, right: -4 }}
        />}
      </View>
    );
  }
}

const styles = StyleSheet.create({

})