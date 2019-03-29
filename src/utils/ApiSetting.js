var baseURL;
if (process.env.NODE_ENV == 'development') {
  baseURL = 'http://localhost:8080';
} else if (process.env.NODE_ENV == 'debug') {
  baseURL = 'http://localhost:8080';
} else if (process.env.NODE_ENV == 'production') {
  baseURL = 'http://localhost:8080';
}

const serviceModule = {
  getLocation: {
    url: '/aiui',
    method: 'post',
    baseURL:baseURL
  },
  getBasicInfo: {
    url: '/workportal/',
    method: 'get'
  }
}
const ApiSetting = {...serviceModule }

export default ApiSetting
