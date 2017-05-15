module.exports = class AG {
  constructor (event = null, params = null, callback = null) {
    if (typeof callback === 'function')
      this.callback = callback
    if (typeof event === 'object' && typeof params === 'object')
      this.validate(event, params)
  }

  validate (event, params) {
    this._param = {}

    try {
      const data = (event.httpMethod == 'GET') ? event.queryStringParameters : JSON.parse(event.body)

      for (let i in params) {
        let config = (typeof params[i] !== 'object') ? {} : params[i]
        config.name = (typeof config.name !== 'string') ? 'undefined' : config.name
        config.required = (typeof config.required !== 'boolean') ? false : config.required
        config.default = (typeof config.default === 'undefined') ? null : config.default
        let included = (typeof data[config.name] !== 'undefined')

        if (config.required && !included) {
          if (typeof this.callback === 'function')
            this.failure({ error: `Required parameter '${config.name}' missing` })
          continue
        }

        this._param[config.name] = (included) ? data[config.name] : config.default
      }
    } catch (e) {
      console.log(`[node-aws-lambda-ag]: Validation error: ${e}`)
    }
  }

  param (name) {
    return (typeof this._param[name] === 'undefined') ? null : this._param[name]
  }

  success (body) {
    this.buildResponse(200, body)
  }

  failure (body, statusCode = 500) {
    if (typeof statusCode !== 'number') statusCode = 500
    this.buildResponse(statusCode, body)
  }

  buildResponse (statusCode, body) {
    if (typeof this.callback !== 'function') {
      console.log('[node-aws-lambda-ag]: Callback function absent')
      return
    }

    this.callback(null, {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(body)
    })
  }
}
