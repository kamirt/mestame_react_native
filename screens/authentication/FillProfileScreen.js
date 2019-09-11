import React from 'react';
import { connect } from 'react-redux'
import Header from "../../components/main/Header";
import StyleSheet from 'react-native-rem-stylesheet'
import { Avatar, Text, Input, Button } from 'react-native-elements';
import { Platform, ActivityIndicator, View, Alert, AsyncStorage } from "react-native";
import PropTypes from 'prop-types'
import * as DocumentPicker from 'expo-document-picker'
import opts from '../../store/tools';
import checkAuth from '../../checkAuth';


class FillProfileScreen extends React.Component {

  static navigationOptions = {
    //headerStyle: {},
    headerTransparent: true,
    headerBackground: <Header />,
    tabBarOptions: {
      style: { height: 1 }
    },
    tabBarVisible: false
  }

  state = {
    email: '',
    avatar: '',
    avatarInfo: null,
    firstName: '',
    lastName: '',
    bio: '',
    errorName: '',
    errorLastName: '',
    errorEmail: '',
    userId: null,
    loading: false,
    savedProfile: null
  }

  // _getProfile = async () => {
  //   let profile = await AsyncStorage.getItem('userProfile')
  //   profile = JSON.parse(profile)
  //   return profile
  // }
  //
  componentDidMount = async () => {
    this.setState({loading: true})
    const { profile } = await checkAuth();
    this.setState({loading: false})
    if (profile.id) {
      this.setState({
        email: profile.email,
        avatar: profile.ava,
        firstName: profile.first_name,
        lastName: profile.last_name,
        bio: profile.bio,
        userId: profile.id
      })
    }
    const savedProfile = AsyncStorage.getItem('userProfile')
    this.setState({ savedProfile: savedProfile })
  }

  render() {

    const savedEmail = () => {
      return this.state.savedProfile && this.state.savedProfile.email
    }

    return (
      <View style={styles.profileWrapper}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Avatar
            rounded
            title={'ava'}
            size={'large'}
            source={{ uri: this.state.avatar }}
            onPress={this._changeAva.bind(this)}
          />
        </View>
        <View>
          {!savedEmail && <Input
            label={this.state.email.length === 0 ? '': 'Email'}
            placeholder='Email'
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.errorEmail}
            value={this.state.email}
            onChangeText={ (text) => {this.setState({email: text}) } }
          />}
          <Input
            label={this.state.firstName.length === 0 ? '': 'Имя'}
            placeholder='Имя'
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.errorName}
            value={this.state.firstName}
            onChangeText={ (text) => {this.setState({firstName: text}) } }
          />
          <Input
            label={this.state.lastName.length === 0 ? '': 'Фамилия'}
            placeholder='Фамилия'
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.errorLastName}
            value={this.state.lastName}
            onChangeText={ (text) => {this.setState({lastName: text}) } }
          />
          <Input
            label={this.state.bio.length === 0 ? '': 'Статус'}
            placeholder='Статус (необязательно)'
            multiline={true}
            value={this.state.bio}
            onChangeText={ (text) => {this.setState({bio: text}) } }
          />
        </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
            { this.state.loading && <ActivityIndicator /> }
            { !this.state.loading &&
              <Button title={'Сохранить'} onPress={this._saveProfile} />
            }
            { savedEmail && savedEmail.length > 0 &&
              <Button title={'Назад'}
                  type={'clear'}
                  onPress={this._goBack.bind(this)}
                  disabled={this.state.loading}
              /> }
          </View>
      </View>
    )
  }

  // methods

  _changeAva () {
    DocumentPicker.getDocumentAsync({type: 'image/*'}).then((result) => {
      if (result.type === 'success') {
        console.log(result)
        this.setState({avatar: result.uri, avatarInfo: result})
      }
    })
  }

  _goBack () {
    this.props.navigation.navigate('Profile');
  }

  _checkInputs () {
    return true
  }

  async saveLocally () {
    const { profile } = await checkAuth()
    return profile
  }

  _collectProfileData () {
    let headers = [];
    let data;
    if (this.state.avatarInfo) {
      data = new FormData()
      data.append("ava", {
        name: this.state.avatarInfo.name,
        type: 'image/jpeg',
        uri: Platform.OS === "android" ? this.state.avatarInfo.uri : this.state.avatarInfo.uri.replace("file://", ""),
      });
      headers.push({'Content-Type': 'multipart/form-data'})
      data.append('email', this.state.email)
      data.append('first_name', this.state.firstName)
      data.append('last_name', this.state.lastName)
      data.append('bio', this.state.bio)
      return { data, headers }
    }
    data = {
      'email': this.state.email,
      'first_name': this.state.firstName,
      'last_name': this.state.lastName,
      'bio': this.state.bio
    }
    return { data, headers }
  }

  _saveProfile = async () => {
    if (!this._checkInputs()) return;
    const {data, headers} = this._collectProfileData()
    this.setState({loading: true})

    const res = await opts.http.post({
      url: '*users/details/' + this.state.userId,
      method: 'PUT',
      headers: headers,
      data: data
    })
    this.setState({loading: false})
    if (res.status === 200) {
      this.saveLocally().then(profile => {
        if (profile.email_confirmed) {
          this.props.navigation.navigate('Profile');
        } else {
          this.props.navigation.navigate('CheckAuth');
        }
      })
    }
  }


}

const styles = StyleSheet.create({
  profileWrapper: {
    padding: 20,
    marginTop: Header.getHeight().fullHeight
  }
})



export default FillProfileScreen;