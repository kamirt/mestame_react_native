import React, { PropTypes } from 'react'
import {
  ActivityIndicator,
  View,
  Image,
  AppState,
  AsyncStorage
} from 'react-native'
import StyleSheet from "react-native-rem-stylesheet"
import { Button, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import Colors from '../../constants/Colors'
import commonStyles from '../../constants/Styles'

import opts from '../../store/tools'
import checkAuth from '../../checkAuth'

class EmailConfirmScreen extends React.Component {

  state = {
    email: '',
    password: '',
    resendSuccess: false,
    loading: false
  }

  async componentDidMount() {
    const { profile } = await checkAuth()
    this.setState({email: profile.email})
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.logoWrapper}>
          <Image style={styles.logo} source={require('../../assets/images/logo.png')}></Image>
        </View>
        { this._renderText() }
        <View>
          {this.state.loading && <ActivityIndicator />}
          {!this.state.loading && <Button
            containerStyle={styles.btn}
            title={'Отправить еще раз'}
            onPress={ this._sendMailOnceAgain }/>}
          <Button containerStyle={styles.btn} title={'Войти'} color={'green'} onPress={ this._goToLoginScreen }/>
        </View>
      </View>
    );
  }

  // methods
  _goToLoginScreen = () => {
    this.props.navigation.navigate('CheckAuth')
  }

  _sendMailOnceAgain = () => {
    const email = this.state.email
    let apiCall = opts.api.register({
      email: email
    })
    this.setState({ loading: true })
    // console.log('MAKING REGISTER REQUEST', apiCall)
    return opts.http[apiCall.method]({
      url: apiCall.url,
      data: apiCall.params
    })
      .then((response) => {
        this.setState({ loading: false })
        if (response.status === 200) {
          this.setState({resendSuccess: true})
        }
      })
      .catch((error) => {
        this.setState({ loading: false })
        // console.log('ERROR', error)
        return error
      })
  }

  _renderText = () => {
    return (
      <View>
        <Text>{`Спасибо за регистрацию! На ваш адрес электронной почты `}
          <Text style={commonStyles.baseTextBold}>{ this.state.email }</Text>
          { ` выслано письмо со ссылкой для подтверждения регистрации. 
            Перейдите по ней, чтобы начать пользоваться приложением.` }</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    backgroundColor: Colors.baseColor
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  logoWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 30
  },
  btn: {
    marginTop: 10
  }
})

export default EmailConfirmScreen;