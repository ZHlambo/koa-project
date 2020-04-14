import { showToast, isLogin } from '../lib/utils';
import config from "./config.js";

const apiHelper = function(url) {
    if (url && url.indexOf('http') === 0) {
        return url;
    } else {
        return config.host + url;
    }
};

// const token = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOm51bGwsImF1ZCI6IjEwMSIsInN1YiI6IjVhY2VjNThhZWM2OGE4NGJjN2MxYjQ5NSIsImFwcGlkIjoiMTAxIiwiZXhwIjoxNTU2NTI5NTA5LCJqdGkiOiJXSnF5X1JKbDJ1ZDBVOWNkaFd1S3d3IiwiaWF0IjoxNTU1OTI0NzA5fQ.MSdIggBW6XzOBw417YblPHKbHFDGM0k3iaTNKtFkNys";
// DEBUG:
let user = uni.getStorageSync("user") || {};
const token = user.access_token;

let defaultOpts = {
  header: {
    'Content-Type': 'application/json; charset=utf-8',
    access_token: uni.getStorageSync("user").access_token || token,
    Authorization: `bearer ${uni.getStorageSync("user").access_token || token}`,
  }
};

const setDefault = function (options = {}) {
  defaultOpts = Object.assign(defaultOpts, options);
};

const setToken = function (token) {
  defaultOpts.header.access_token = token;
  defaultOpts.header.Authorization = `bearer ${token}`;
}

const requestPromise = (url, method, data, options) => {
    return new Promise(function(resolve, reject) {
        uni.request(
            Object.assign(
                {
                    url: apiHelper(url),
                    method,
                    data,
                    success: function(res) {
                        let statusCode = res.statusCode;
                        if (statusCode === 401) {
                          uni.removeStorageSync("user");
                          isLogin().then(res => {
                            resolve(requestPromise(url, method, data, options));
                          });
                        }
                        let response = res.data;
                        if (statusCode == 200) {
                          resolve(response.result || response);
                        }
                    },
                    fail: function(e) {
						// #ifdef MP-ALIPAY
							let statusCode = e.statusCode;
							if (statusCode === 401) {
							  uni.removeStorageSync("user");
							  console.log('denglu')
							  isLogin().then(res => {
							    resolve(requestPromise(url, method, data, options));
							  });
							  return
							}
						// #endif

                        const errMsg = '服务器繁忙, 请稍后再试';
                        if (
                            options.error &&
                            typeof options.error === 'function'
                        ) {
                            showToast.message(errMsg);
                            return options.error(new Error(errMsg), reject);
                        } else {
                          showToast.message(errMsg);
                          reject(e)
                        }
                    }
                },
                options
            )
        );
    });
};

function requestMethod(method = 'GET') {
  return function (url, data = {}, header = {}) {
    let options = Object.assign({}, defaultOpts);
    options.header = Object.assign(options.header, header);
    return requestPromise(
      url,
      method,
      data,
      options
    );
  };
}

module.exports = {
  get: requestMethod('GET'),
  post: requestMethod('POST'),
  put: requestMethod('PUT'),
  delete: requestMethod('DELETE'),
  setDefault,
  setToken,
};
