# Node AWS Lambda API Gateway

A tiny AWS Node helper for [API Gateway Lambda proxies](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html).

Useful for handling gateway parameters (both query and body), require parameters, setting default values and responses.

## Install
Using npm:
```
npm install node-aws-lambda-ag --save
```

## Usage

```javascript
import AG from 'node-aws-lambda-ag'

// Define expected API Gateway parameters
const PARAMS = [
  {
    name: 'category',
    required: true,
    default: 'none'
  },
  {
    name: 'offset',
    required: false,
    default: 0
  },
  {
    name: 'limit',
    required: false,
    default: 15
  }
]

export const main = (event, context, callback) => {
  let ag = new AG(event, PARAMS, callback)

  // Fetch parameters
  console.log('Got param: ', ag.param('category'))

  // Send failed response
  if (ag.param('limit') > 100)
    ag.failure({ error: 'Limit overflow' })

  // Send successful response
  else
    ag.success({ status: 'ok' })
}
```

If a callback method is provided and a required parameter isn't found, a failed response will automatically be issued.

## API
**Constructor**
```javascript
constructor(event, params, callback = null)
```
- **event** (Object) - the AWS Lambda [event](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)
- **params** (Array) - your predefined params
- **callback** (Function, optional) - the [callback](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html#nodejs-prog-model-handler-callback) function used by responses

**Retrieveing a parameter**
```javascript
AG.param(name)
```
- **name** (String) - the name of the param to retrieve. If the param was not provided by the request the predefined default will be returned. If no default is set or the param is non-existing, `null` will be returned.

**Sending a success response**
```javascript
AG.success(response)
```
- **response** (Object) - send a status 200 response with the provided object.

**Sending a failed response**
```javascript
AG.failure(response)
```
- **response** (Object) - send a status 500 response with the provided object.
