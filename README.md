# run-on-ssh

Run a node.js script on a given ssh server

[![Build Status](https://img.shields.io/travis/ForbesLindesay/run-on-ssh/master.svg)](https://travis-ci.org/ForbesLindesay/run-on-ssh)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/run-on-ssh/master.svg)](http://david-dm.org/ForbesLindesay/run-on-ssh)
[![NPM version](https://img.shields.io/npm/v/run-on-ssh.svg)](https://www.npmjs.org/package/run-on-ssh)

## Installation

```
npm install run-on-ssh --save
```

## Usage

```js
var runOnSsh = require('run-on-ssh');

return runOnSsh({
  // see https://www.npmjs.com/package/ssh2 .connect for `remote` option.
  remote: {host, password},
  directory: __dirname + '/path/to/folder',
  nodeVersion: 'v6.4.0', // defaults to `process.version`
  env: {MY_ENV_VAR: 'foo'},  // defaults to `{}` so you don't accidentally expose your environment
  args: ['bar'], // defaults to `[]`
  // N.B. debug defaults to false if `process.env.NODE_ENV === 'production'`
  debug: false,
}).then(res => assert(res === '00017foobar\n'));
```

## License

MIT
