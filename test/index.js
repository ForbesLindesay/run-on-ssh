import assert from 'assert';
import test from 'testit';
import runOnSsh from '../src';

const host = '<TODO>';
const password = '<TODO>';
console.log('Tests not run because I do not have an ssh box to run them on');
process.exit(0);

test('it runs code on a remote server via ssh', () => {
  const runCommand = runOnSsh({
    remote: {host, password},
    directory: __dirname + '/fixture',
    nodeVersion: 'v6.4.0', // defaults to `process.version`
    // N.B. debug defaults to false if `process.env.NODE_ENV === 'production'`
    debug: false,
  });
  return runCommand({
    env: {MY_ENV_VAR: 'foo'},  // defaults to `{}` so you don't accidentally expose your environment
    args: ['bar'], // defaults to `[]`
  }).then(res => assert(res === '00017foobar\n'));
});
