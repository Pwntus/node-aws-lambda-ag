# Node AWS Lambda API Gateway

A tiny AWS Node helper for [API Gateway Lambda proxies](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html).

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
