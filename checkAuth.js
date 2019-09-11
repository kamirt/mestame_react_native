import tools from "./store/tools";
import { AsyncStorage } from 'react-native';
// инструменты
const CHECK_AUTH_REQUEST = tools.api.checkAuth,
      /*
        список маршрутов, куда перебросит пользователя
        в зависимости от результатов проверки авторизации и профиля
      */
      AFTER_AUTH_ROUTES = {
        notAuthorized: 'Auth',
        emailNotConfirmed: 'EmailConfirm',
        profileNotFilled: 'FillProfile',
        ok: 'Main'
      };

const checkAuth = async () => {
  let apiCall = CHECK_AUTH_REQUEST()
  let authResponse = await tools.http[apiCall.method]({
    url: apiCall.url
  })
  let csrfCookie = '';
  let routeToContinue = AFTER_AUTH_ROUTES.notAuthorized;

  const headers = authResponse.headers
  if (headers && headers.map['set-cookie']) {
    csrfCookie = headers.map['set-cookie']
    csrfCookie = csrfCookie.split('; ').map(el => {
      let obj = {}
      obj[el.split('=')[0]] = el.split('=')[1]
      return obj
    }).filter(el => { return Object.keys(el)[0] === 'csrftoken' })[0].csrftoken
  }
  // Токен протух, на страницу авторизации
  if (authResponse.status === 401) {
    routeToContinue = AFTER_AUTH_ROUTES.notAuthorized
  }
  // Проверяем заполнение профиля
  let profile = await authResponse.json()
  if (profile && profile.email.length > 0 && !profile.email_confirmed) {
    routeToContinue = AFTER_AUTH_ROUTES.emailNotConfirmed
  }
  if (!profile || (!profile.email || !profile.first_name)) {
    routeToContinue = AFTER_AUTH_ROUTES.profileNotFilled
  }
  routeToContinue = AFTER_AUTH_ROUTES.ok
  AsyncStorage.setItem('userProfile', JSON.stringify(profile))
  return { routeToContinue, csrfCookie, profile }
}
export default checkAuth