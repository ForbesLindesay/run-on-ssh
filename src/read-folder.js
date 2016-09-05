import fs from 'fs';
import {createHash} from 'crypto';
import Promise from 'promise';
import lsr from 'lsr';

const readFile = Promise.denodeify(fs.readFile);

function order(a, b) {
  return a.path < b.path ? -1 : 1;
}
export default function readFolder(dirname, nodeVersion) {
  return lsr(dirname, {filter(entry) { return entry.name !== 'node_modules'; }}).then(res => {
    return Promise.all(res.sort(order).map(entry => {
      if (entry.isDirectory()) {
        return {type: 'directory', path: entry.path};
      } else {
        return readFile(entry.fullPath).then(content => {
          return {type: 'file', path: entry.path, content};
        });
      }
    }));
  }).then(entries => {
    const hash = createHash('sha1');
    hash.update(nodeVersion);
    entries.forEach(entry => {
      hash.update(entry.type, 'utf8');
      hash.update(entry.path, 'utf8');
      if (entry.type === 'file') {
        hash.update(entry.content);
      }
    });
    return {entries, hash: hash.digest('hex')};
  });
}
