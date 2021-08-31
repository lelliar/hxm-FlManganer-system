import axios from './instance'

export const login = (form) => {
  return axios.post('/proxy/dev/auth/login', form)
}
