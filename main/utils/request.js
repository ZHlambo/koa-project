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
