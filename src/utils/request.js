import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path,operateId) {
  if(path && operateId) path = path.replace(/\{[^\}]+\}/g,operateId)
  if (/^https?:\/\//.test(path)) {
    return path;
  } else {
    return path[0] !== '/' ? '/' + path : path;
  }
}

let request = {}
methods.forEach(method => {
  request[method] = (path, {
    operateId,
    headers,
    params,
    data,
    fields,
    files,
    query
  } = {}) => new Promise((resolve, reject) => {
    const _request = superagent[method](formatUrl(path,operateId));
    if (headers) {
      _request.set(Object.assign({
        'content-type': 'application/json',
        'accept': 'application/json',
      }, headers || {}));
      if(headers.Authorization == undefined) {
        return
      }
    }
    headers = headers || {}
    headers['X-STORE-ID'] = "57eb727ff228f203b339ba33"
    params = params || {}
    // let iterater = (object)=>{
    //   for (var key in object) {
    //     let func = (value,returnKey) => {
    //       let fegExp = new RegExp(value+"$")
    //       if(fegExp.test(key.toLowerCase())){
    //         if (typeof object[key] === "string") {object[key] = `::${returnKey}::${object[key]}`}
    //         else if (typeof object[key] === "object") {
    //           for (var keyC in object[key]) {
    //             if(keyC == '$in'){
    //               for (var i = 0; i < object[key][keyC].length; i++) {
    //                 object[key][keyC][i] = `::${returnKey}::${object[key][keyC][i]}`
    //               }
    //             }else{
    //               object[key][keyC] = `::${returnKey}::${object[key][keyC]}`
    //             }
    //           }
    //         }
    //       }
    //     }
    //     func("created","date")
    //     func("updated","date")
    //     func("id","id")
    //     func("ids","id")
    //     if (typeof object[key] === "object") {console.log(object[key]);iterater(object[key])}
    //   }
    // }
    if (query) {
      // if(query.find) iterater(query.find)
      params.q = JSON.stringify(query)
    }
    _request.query(params);

    if (data) {
      _request.send(data);
    }

    if (fields) {
      Object.keys(fields).forEach(key => {
        _request.field(key, fields[key]);
      })
    }

    if (Array.isArray(files) && files.length > 0) {
      files.forEach((file) => {
        _request.attach('file', file, file.name);
      })
    }

    _request.end((err, {
      body
    } = {}) => err ? reject(body || err) : resolve(body));
  })

});

export default request;
