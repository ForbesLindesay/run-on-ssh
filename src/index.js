import Promise from 'promise';
import SSH from './ssh';
import readFolder from './read-folder';
import copyEntriesToDir from './copy-entries-to-dir';

// remote = {host: ipAddress, port: 22, username: 'root', password}
export default function runOnSsh({remote, directory, nodeVersion, env, args, debug}) {
  nodeVersion = nodeVersion || process.version;
  env = env || {};
  args = args || [];
  const connection = new SSH({
    port: 22,
    username: 'root',
    ...remote,
  }, {debug});
  const envString = Object.keys(env).map(key => {
    return key + '="' + env[key] + '" ';
  }).join(' ');
  const argsString = args.map(arg => ' "' + arg + '"').join('');
  return Promise.all([readFolder(directory), connection.ready]).then(([dir]) => {
    return connection.exec('cd ~/' + dir.hash).catch(
      () => copyEntriesToDir(connection, dir.entries, '~/' + dir.hash).then(
        () => connection.exec(['cd ~/' + dir.hash, 'nvm install ' + nodeVersion, 'npm install']),
      ),
    ).then(
      () => connection.exec(
        ['cd ~/' + dir.hash, 'nvm use ' + nodeVersion, envString + 'node index.js' + argsString],
        {debug: typeof debug === 'undefined' ? process.env.NODE_ENV !== 'production' : debug},
      ),
    ).then(
      stdout => stdout.replace(/^Now using.*\n/, ''),
    );
  }).finally(
    () => connection.close()
  );
}
