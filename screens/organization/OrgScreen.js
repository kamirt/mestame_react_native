import React from 'react';
import { connect } from 'react-redux'
import Header from "../components/main/Header";
import Icon from "../components/utils/Icon";
import StyleSheet from 'react-native-rem-stylesheet';

import { Avatar, Text, Button } from 'react-native-elements';
import { View, AsyncStorage } from "react-native";
import PropTypes from 'prop-types'

import Colors, {darkColor, tintColor} from '../constants/Colors'
import bstyle from '../constants/Styles';

class ProfileScreen extends React.Component {

  static propTypes = {
    afterRegistration: PropTypes.bool
  }

  static navigationOptions = {
    //headerStyle: {},
    headerTransparent: true,
    headerBackground: <Header />,
    tabBarOptions: {
      style: { height: 1 }
    },
    tabBarVisible: false
  }

  componentDidMount() {
    this.props.dispatch({ type:'GET_AUTHORIZE_PROFILE' })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.profile.email) {
      AsyncStorage.setItem('userPfofile', JSON.stringify(nextProps.profile))
    }
  }

  _addOrgBlock () {
    return (
      <Button title={'Добавить организацию'} onPress={this._goToCreation.bind(this)} />
    )
  }

  _orgBlock () {
    let org = this.props.profile.organization

    return (
      <View style={styles.orgBlock}>
        <Text style={{color: Colors.lightColor, fontSize: 10}}>{'Организация:'}</Text>
        <View style={{...bstyle.rowVerticalCenter}}>
          <Avatar
            size={'medium'}
            source={{ uri: org.logo }}
          />
          <Text style={{marginLeft: 10, color: tintColor}}>{ org.name }</Text>
        </View>
      </View>
    )
  }

  render() {

    const { navigation } = this.props;
    const edit = navigation.getParam('edit', false);

    return (
      <View style={styles.profileWrapper}>
        { this.props.profile.id && <View>
          <View style={{...styles.profileHeader, ...bstyle.rowVerticalCenter}}>
            <Avatar
              rounded
              title={this.getNameLetters.call(this)}
              size={'large'}
              source={{ uri: this.props.profile.ava }}
            />
            <Text style={{fontSize: 14}}>{`${this.props.profile.first_name} ${this.props.profile.last_name}`}</Text>
            <Icon name={'account-edit'} color={darkColor} tap={() => { this.props.navigation.navigate('FillProfile') }} />
          </View>

          {!this._orgExist() && this._addOrgBlock() }
          {this._orgExist() && this._orgBlock() }
          <View style={styles.tools}>
            <Button title={'Создать событие'} onPress={this._goToCreation.bind(this)} />
          </View>

        </View> }
      </View>
    )
  }

  // methods

  _orgExist () {
    return this.props.profile.organization
  }

  _goToCreation () {
    this.props.navigation.navigate('PlaceCreate');
  }
  getNameLetters () {
    const { name, lastName } = {
      name: this.props.profile.first_name,
      lastName: this.props.profile.last_name
    }
    if (typeof(name) !== 'string' || typeof(lastName) !== 'string') {
      console.warn('Profile name attrs is not string', typeof(name))
      return ''
    }
    const nl = this.props.profile.first_name[0] + this.props.profile.last_name[0]
    if (!nl || isNaN(nl)) {
      return ''
    }
    return nl
  }


}

const styles = StyleSheet.create({
  profileWrapper: {
    padding: 20,
    marginTop: Header.getHeight().fullHeight
  },
  profileHeader: {
    justifyContent: 'space-between'
  },
  orgBlock: {
    marginTop: 5,
    alignItems: 'flex-start'
  },
  tools: {
    marginTop: 10
  }
})


const mapStateToProps = state => ({
  profile: state.profile.profile
});

export default connect(mapStateToProps)(ProfileScreen);