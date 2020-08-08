[![npm](https://img.shields.io/npm/v/micro-secret.svg)](https://www.npmjs.com/package/micro-secret)

## Use case

For when you want simple Bearer secret authentication of a [micro](https://www.npmjs.com/package/micro) service or [vercel](https://vercel.com) node.js lambda.

## What it does

Wraps a [vercel node.js lambda](https://vercel.com/docs/v2/serverless-functions/supported-languages#node.js) with authentication. Takes a secret passed as either an `Authorization Bearer` secret or as `apiToken` URL parameter or a header key you configure.

## Configuration

Requires first argument of an array of secrets. An array is handy for allowing secret rotation.
Takes an optional second configuration object argument:

- `whitelist`: an optional whitelist of paths.
- `resAuthMissing`: Optional string for use when Authentication is missing from request.
- `resAuthInvalid`: Optional string for use when request not authorized.
- `headerKey`: Optional request header key for getting request secret.

## Usage

Wrap your lambda as in the examples below. Then pass the configured secret string as an `Authorization` header:

```javascript
Authorization Bearer <your secret here>
```

Or, pass as a query parameter:

```javascript
https://my-protected-service.vercel.app/?apiToken=<your secret here>
```

## Examples

### Simple

```javascript
const withAuth = require('micro-secret');
const MY_SECRETS = ['parrots'];

module.exports = withAuth(MY_SECRETS)(async (req, res) => {
  return `Hey sailor!`;
});
```

### With whitelist

```javascript
const withApiAuth = require('micro-secret');
const MY_SECRETS = ['parrots'];
const WHITELIST = ['pirates'];

module.exports = withAuth(MY_SECRETS, { whitelist: WHITELIST })(
  async (req, res) => {
    return `Hey sailor!`;
  }
);
```

### With custom header key

```javascript
const withAuth = require('micro-secret');
const MY_SECRETS = ['parrots'];
const WHITELIST = ['pirates'];
const MY_SECRET_HEADER_KEY = ['x-marks-the-spot'];

module.exports = withAuth(MY_SECRETS, {
  whitelist: WHITELIST,
  headerKey: MY_SECRET_HEADER_KEY,
})(async (req, res) => {
  return `Hey sailor!`;
});
```

### With multiple wrappers

```javascript
const withAuth = require('micro-secret');
const withPirateShip = require('with-trusty-pirate-ship');

const MY_SECRETS = ['parrots'];
const WHITELIST = ['pirates'];

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

module.exports = compose(
  withAuth(MY_SECRETS, { whitelist: WHITELIST }),
  withPirateShip
)(async (req, res) => {
  return `Hey sailor!`;
});
```

## Previously known as..

... now-secret.

## Alternatives

This module is a fork of [micro-jwt-auth](https://www.npmjs.com/package/micro-jwt-auth) which provides similar functionality with a JWT token.
