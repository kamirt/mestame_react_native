export default {
  login: (opts) => {
    return {
      url: '*users/auth/',
      params: {
        username: opts.email,
        password: opts.password
      },
      method: 'post'
    }
  },
  register: (opts) => {
    return {
      url: '*profile/register/',
      params: {
        email: opts.email,
        passwordFirst: opts.password,
        passwordRepeat: opts.passwordConfirm
      },
      method: 'post'
    }
  },
  socialLogin: (opts) => {
    return {
      url: '*users/login/social/knox/',
      params: {
        provider: opts.provider,
        code: opts.code,
        redirect_uri: opts.redirect_uri
      },
      method: 'post'
    }
  },
  checkAuth: (opts) => {
    // для запроса профиля
    return {
      url: '*users/authorize/',
      method: 'get'
    }
  },
  resendConfirmMail: (opts) => {
    // если не пришло письмо, отправить еще раз
    return {
      url: '*users/resend-mail/',
      method: 'post',
      params: {
        email: opts.email
      },
    }
  }
}