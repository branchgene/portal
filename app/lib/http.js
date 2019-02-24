import axios from 'axios';
// dude, whyyy
// remove this when they fix: https://github.com/mzabriskie/axios/issues/97
/*axios.defaults.transformRequest = [(data) => {
  if (!data) {
    return;
  }
  if (data.__isJSON) {
    delete data.__isJSON;
    return JSON.stringify(data);
  }
  const urlencoded = Object.keys(data).map(key => (
    `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
  )).join('&');
  return urlencoded;
}];*/
/**
 * The API is the same as https://github.com/mzabriskie/axios, where `http() === axios`.
 * Usage:
 *
 *		http().get('/some-url').then().catch();
 *
 * @return {axios} An axios instance with preconfigured stuff.
 */
export default function http() {
  return axios;
}
http.setToken = (token) => {
  axios.defaults.headers.common.cirrustoken = token;
};
http.setBase = (base) => {
  axios.defaults.baseURL = base;
};
export const getBase = () => `${axios.defaults.baseURL}`;
http.getConfig = () => axios.get('/api/config');

http.login = function login({ email, password }) {
  return axios.post('users/login', {
    email,
    password,
    __isJSON: true
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
