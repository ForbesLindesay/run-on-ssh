import Promise from 'promise';

export default function copy(ssh, entries, destinationDirectory) {
  return ssh.exec('mkdir ' + destinationDirectory).then(
    () => new Promise((resolve, reject) => {
      function next(i) {
        if (i >= entries.length) {
          return resolve();
        }
        const entry = entries[i];
        const result = (
          entry.type === 'directory'
          ? ssh.exec('mkdir ' + destinationDirectory + entry.path.substr(1))
          : ssh.exec('cat > ' + destinationDirectory + entry.path.substr(1), {stdin: entry.content})
        );
        result.done(() => next(i + 1), reject);
      }
      next(0);
    }),
  );
}
