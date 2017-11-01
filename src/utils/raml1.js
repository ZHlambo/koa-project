/**
 *
 *����raml�ļ�
 *
 * */
const parser = require('raml-1-parser');

class Raml {

  constructor(api) {
    this.api = api
    this._routes = []
    this._validates = {}
    this._types = {}
  }

  routes() {
    if (this._routes.length) {
      return this._routes
    }
    let parseResource = (resources, uri) => {
      let resource,
        methods,
        obj;
      for (let i = 0; i < resources.length; i++) {
        resource = resources[i];
        methods = resource.methods;
        if (methods) {
          for (let j = 0; j < methods.length; j++) {
            obj = {
              verb: methods[j].method,
              uri: uri + resource.relativeUri,
              description: methods[j].description,
              handlerFunc: methods[j].annotations.handlerFunc.structuredValue,
              groupBy: methods[j].annotations.groupBy.structuredValue
            };
            if (methods[j].body) {
              obj.body = {
                example: methods[j].body["application/json"].example,
                type: methods[j].body["application/json"].type
              };
            }
            this._routes.push(obj)
          }
        }

        if (resource.resources) {
          parseResource(resource.resources, uri + resource.relativeUri);
        }
      }
    }

    parseResource(this.api.resources, "");
    return this._routes

  }

  validates() {
    if (Object.keys(this._validates).length) {
      return this._validates

    }
    for (let type of this.api.types) {
      let name = Object.keys(type)[0]
      this._types[name] = type[name].type[0]

    }
    let parseMethod = (ancestorUri, method) => {
      if (method.body && method.body['application/json']) {
        let typeRaw = method.body['application/json'].type[0]
        try {
          let body = JSON.parse(this._types[typeRaw])
          this._validates[`${method.method} ${ancestorUri}`] = Object.assign(this._validates[`${method.method} ${ancestorUri}`] || {}, {body})

        } catch (e) {}
      }

    }
    let parseResource = (ancestorUri, resource) => {
      let methods = resource.methods
      ancestorUri = ancestorUri + resource.relativeUri
      if (methods) {
        for (let method of methods) {
          parseMethod(ancestorUri, method)

        }

      }
      let resources = resource.resources
      if (resources) {
        for (let resource of resources) {
          parseResource(ancestorUri, resource)

        }

      }

    }
    let resources = this.api.resources
    if (resources) {
      for (let resource of resources) {
        parseResource('', resource)

      }

    }
    return this._validates

  }

}

module.exports = function raml(filepath) {
  let _api = parser.loadApiSync(filepath)
  let api = _api.toJSON()
  return new Raml(api)

}
