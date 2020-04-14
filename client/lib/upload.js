import request from './http.js';
let url = uni.getStorageSync("qiniuUrl") || 'https://up.qbox.me/';
// NOTE: 防止重试机制一直请求；
let reDo = false;
// TODO: 没上传一张图片都获取一次token，优化项

export default function (filePath, success, fail, progress) {
    let options = { filePath };
    if (null == options.filePath) {
        return;
    }
    let { token, access_host, time } = getApp().globalData.uploadToken || {};
    this.filePath = filePath;
    if (time <= 2 * 60 * 60 * 1000) {
      Object.assign(options, getApp().globalData.uploadToken);
      this.uploadTask = doUpload(options, success, fail, progress);
      return this;
    }
    this.tokenPromise = new Promise(resolve => {
        if (!time || new Date(time) <= new Date()) {
            request.get('/api/third/form/upload/token').then(res => {
                getApp().globalData.uploadToken = {
                    token: res.token,
                    access_host: res.access_host,
                    time: new Date().getTime() + 60 * 60 * 1000
                };
                uni.setStorageSync("access_host", res.access_host);
                resolve();
            });
        } else {
            resolve();
        }
    }).then(() => {
        Object.assign(options, getApp().globalData.uploadToken);
        this.uploadTask = doUpload(options, success, fail, progress);
    });
    return this;
}

function doUpload(options, success, fail, progress) {
    var uploadTask = uni.uploadFile({
        fail,
        url,
        filePath: options.filePath,
		//#ifdef MP-ALIPAY
		fileType: 'image',
		// #endif
        name: 'file',
        formData: {
            token: options.token
        },
        success: function(res) {
            var dataString = res.data;
            if (res.statusCode == 400 && res.data && !reDo) {
              uni.setStorageSync("qiniuUrl", "https://up.qbox.me/");
              url = "https://up.qbox.me/";
              reDo = true;
              uploadTask = doUpload(options, success, fail, progress);
              return ;
            }
            if (res.data.hasOwnProperty('type') && res.data.type === 'Buffer') {
                dataString = String.fromCharCode.apply(null, res.data.data);
            }
            try {
                var dataObject = JSON.parse(dataString);
                var imageUrl = options.access_host;
                imageUrl = imageUrl + dataObject.key;
                success && success(imageUrl);
            } catch (e) {
                fail && fail(e);
            }
        },
    });

    uploadTask.onProgressUpdate(res => {
        progress && progress(res);
    });

    return uploadTask;
}
