import React from 'react'
import {
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  Text,
  WebView,
  Modal,
  Alert,
  AsyncStorage
} from 'react-native'
import StyleSheet from "react-native-rem-stylesheet"
import SimpleInput from '../../components/input/SimpleInput'
import FadeIn from '../../components/animation/FadeIn'
import { Button } from 'react-native-elements'
import opts from "../../store/tools";


class AuthScreen extends React.Component {

  componentDidMount() {
    this._getProviders()
  }

  _getProviders = async () => {
    let response = await opts.http.get({url: '*profile/providers'})
    if (response.status === 200) {
      let json = await response.json()
      this.setState({providers: json})
    }
  }

  state = {
    mode: 'login',
    showText: true,
    email: '',
    password: '',
    passwordConfirm: '',
    emailError: '',
    passwordError: '',
    passwordConfirmError: '',
    modalVisible: false,
    modalUrl: '',
    providers: {},
    activeProvider: null,
    socLogin: false,
    loading: false
  }


  render() {
    return (
        <View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}>
            {this.state.modalVisible && <WebView
              onNavigationStateChange={this._onWebViewStateChange.bind(this)}
              source={{uri: this.state.modalUrl}}
            />}
          </Modal>
          <View style={styles.logoWrapper}>
            <Image style={styles.logo} source={require('../../assets/images/logo.png')}></Image>
            {this.props.isLoading && <ActivityIndicator />}
          </View>
          <View style={styles.wrapper}>
            <FadeIn fade={this.state.showText}>
              <Text style={{textAlign: 'center'}}>{this.state.mode === 'login' ? 'Вход' : 'Регистрация'}</Text>
            </FadeIn>
            <SimpleInput
                value={this.state.email}
                style={{marginTop: 20}}
                placeholder={'E-mail'}
                onChangeText={(text) => {this.clearErrors(); this.setState({email: text})}}
                onSubmitEditing={this._toggleInput.bind(this, 'passwd')}
                textContentType={'emailAddress'}
                returnKeyType='next'>
            </SimpleInput>
            {this.state.emailError.length > 0 && <Text style={styles.error}>{ this.state.emailError }</Text>}
            <SimpleInput
                value={this.state.password}
                ref="passwd"
                style={{marginTop: 20}}
                placeholder={'Пароль'}
                textContentType={'password'}
                onChangeText={(text) => {this.clearErrors(); this.setState({password: text})}}
                onSubmitEditing={this._toggleInput.bind(this, this.state.mode === 'login' ? undefined : 'passwdConfirm')}
                secureTextEntry={true}>
            </SimpleInput>
            {this.state.passwordError.length > 0 && <Text style={styles.error}>{ this.state.passwordError }</Text>}
            {
              this.state.mode === 'registration' && <SimpleInput
                  value={this.state.passwordConfirm}
                  ref="passwdConfirm"
                  style={{marginTop: 20}}
                  placeholder={'Пароль ещё раз'}
                  textContentType={'password'}
                  onChangeText={(text) => {this.clearErrors(); this.setState({passwordConfirm: text})}}
                  onSubmitEditing={this._toggleInput.bind(this, undefined)}
                  secureTextEntry={true}>
              </SimpleInput>
            }
            {this.state.passwordConfirmError.length > 0 && <Text style={styles.error}>{ this.state.passwordConfirmError }</Text>}
            <Button
              title={this.state.mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              onPress={this._toggleInput.bind(this, undefined)}
              containerStyle={{ marginTop: 20 }}
            ></Button>
          </View>
          <View style={styles.wrapper}>
            <FadeIn fade={this.state.showText}>
              <Text>
                {this.state.mode === 'login' ? 'Нет аккаунта?' : 'Уже загеристрированы?' }
                <Text
                    style={styles.link}
                    onPress={this._toggleMode.bind(this)}
                > {this.state.mode === 'login' ? 'Зарегистрируйтесь!' : 'Войдите!' }</Text>
              </Text>
            </FadeIn>
          </View>
          <View style={[styles.wrapper, { paddingTop: 40 }]}>
              <Text>Или войдите с помощью социальных сетей:</Text>
          </View>
          {this.state.providers.vk && <View style={styles.socIconsContainer}>
            <TouchableOpacity
                style={styles.socIcon}
                onPress={this._onSocButtonPressed.bind(this, 'vk')}>
              <Image title={''} style={styles.socIcon}
                     source={require('../../assets/images/vk.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.socIcon}
                onPress={this._onSocButtonPressed.bind(this, 'facebook')}>
              <Image title={''} style={styles.socIcon}
                     source={require('../../assets/images/facebook.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.socIcon}
                onPress={this._onSocButtonPressed.bind(this, 'yandex')}>
              <Image title={''} style={styles.socIcon}
                     source={require('../../assets/images/yandex.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.socIcon}
                onPress={this._onSocButtonPressed.bind(this, 'google')}>
              <Image title={''} style={styles.socIcon}
                     source={require('../../assets/images/google.png')}></Image>
            </TouchableOpacity>
          </View>}
          {this.state.loading && <View><Text>LOADING...</Text></View>}
        </View>
    );
  }

  // methods
  _onWebViewStateChange (opts) {
    const url = opts.url
    const codeExist = url.indexOf('?code=') >= 0
    if (codeExist) {
      const code = url.slice(url.indexOf('?code=') + '?code='.length, url.length)
      this.socLoginFinish(code)
    } else {
      this.setState({ 'loading': false })
      Alert.alert('Неизвестная ошибка', JSON.stringify(opts))
    }
    this.setState({modalVisible: false})
  }

  _onSocButtonPressed (provider) {
    //Alert.alert('button pressed!')
    this.socLogin(provider)
    this.setState({ 'loading': true })
  }

  _toggleMode () {
    this.setState({ showText: false })
    setTimeout(() => {
      if (this.state.mode === 'login') {
        this.setState({ mode: 'registration', showText: true })
      } else {
        this.setState({ mode: 'login', showText: true })
      }
    }, 300)

  }

  _toggleInput (elType) {
    // переключает фокус на следующий инпут
    const els = { passwd: 'passwd', passwdConfirm: 'passwdConfirm' }
    if (els[elType] && this.refs[els[elType]]) {
      this.refs[els[elType]].focus()
      return
    }
    if (!elType) {
      this._checkInput.call(this)
    }
  }

  _checkInput () {
    let errors = false
    const modes = {
      login: (clearParams) => {
        this.login(clearParams)
      },
      registration: (clearParams) => {
        this.register(clearParams)
      }
    }
    const { mode, email, password, passwordConfirm } = this.state
    if (email.indexOf('@') <= 0) {
      this.setState({ emailError: 'Неверно введен email' })
      errors = true
    }
    if (password.length === 0) {
      this.setState({ passwordError: 'Неверно введен пароль' })
      errors = true
    }
    if (mode === 'register' && (password !== passwordConfirm || password.length === 0)) {
      this.setState({ passwordConfirmError: 'Пароли не совпадают' })
      errors = true
    }
    if (!errors) {
      modes[mode]({ email: email, password: password, passwordConfirm: passwordConfirm })
    }
  }

  clearErrors () {
    this.setState({emailError: '', passwordError: '', passwordConfirmError: '' })
  }

  async login (clearParams) {
    let apiCall = opts.api.login({email: clearParams.email, password: clearParams.password})
    const response = await opts.http[apiCall.method]({
      url: apiCall.url,
      data: apiCall.params
    })

    if (response.status.toString()[0] !== '2') {
      Alert.alert('Ошибка', 'Попытка входа не удалась')
      return
    }

    const json = await response.json()
    AsyncStorage.setItem('authToken', json.token)
    this.setState({ 'loading': false })
    this.props.navigation.navigate('Main');
  }

  async register (clearParams) {
    await AsyncStorage.removeItem('authToken')
    await AsyncStorage.removeItem('userProfile')
    let apiCall = opts.api.register({
      email: clearParams.email,
      password: clearParams.password,
      passwordConfirm: clearParams.passwordConfirm
    })
    return opts.http[apiCall.method]({
      url: apiCall.url,
      data: apiCall.params
    })
      .then((response) => {
        console.log('RESPONSE WRONG', response)
        if (response.status === 201) {
          console.log('RESPONSE NORMAL')
          response.json().then(token => {
            AsyncStorage.setItem('authToken', json.token)
            this.setState({ 'loading': false })
            this.props.navigation.navigate('EmailConfirm');
          })
        }

      })
      .catch((error) => {
        // console.log('ERROR', error)
        return error
      })


  }

  async socLogin (provider) {
    await AsyncStorage.removeItem('authToken')
    await AsyncStorage.removeItem('userProfile')
    let network = this.state.providers[provider]
    if (!network) return
    const strParams = Object.keys(network.params).map((el) => {
      return `${el}=${network.params[el]}&`
    })
    let url = `${network.url}?${strParams.join('')}`
    this.setState({ modalVisible: true, modalUrl: url, activeProvider: provider })
  }

  socLoginFinish = async (code) => {
    if (!this.state.activeProvider) {
      Alert.alert('Провайдер не выбран')
      return
    }
    const provider = this.state.providers[this.state.activeProvider]
    const res = await opts.http.post({
      url: '*profile/login/social/knox/',
      data: {
        provider: provider.name,
        code: provider.name === 'facebook' ? code + '=_' : code,
        redirect_uri: provider.params.redirect_uri
      }
    })
    if (res.status === 200) {
      this.setState({socLogin: true})
      res.json().then((json) => {
        AsyncStorage.setItem('authToken', json.token)
        return
      })
    } else {
      Alert.alert('Произошла ошибка', JSON.stringify(res))
    }
  }

}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  socIcon: {
    width: 50,
    height: 50,
    marginLeft: 10
  },
  socIconsContainer: {
    padding: 40,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  wrapper: {
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40
  },
  logoWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 30
  },
  link: {
    color: '#6897ff'
  },
  error: {
    color: '#ff2116'
  }
})

export default AuthScreen