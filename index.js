const { spawn, spawnSync } = require('child_process');
const { exists, existsSync } = require('fs');

function mkfifoSync(path) {
  const perm = arguments[1] || 644;
  if (typeof perm !== 'number') {
    throw new Error('permission must be a number');
  }
  const proc = spawnSync('mkfifo', [path, '-m', perm], { stdio: 'ignore' });
  if (proc.status !== 0 || !existsSync(path)) {
    throw new Error('unable to create the pipe. do you have permissions?');
  }
}

function mkfifo(path) {
  const perm = arguments[1] || 644;
  if (typeof perm !== 'number') {
    throw new Error('permission must be a number');
  }
  const func =
    arguments[2] ||
    (() => {
      throw new Error(
        'async version called without a callback. Use "mkfifoSync"'
      );
    })();
  const proc = spawn('mkfifo', [path, '-m', perm], { stdio: 'ignore' });
  proc.once('exit', status => {
    exists(path, success => {
      if (status !== 0 || !success) {
        func(new Error('unable to create the pipe. do you have permissions?'));
        return;
      }
      func(null);
    });
  });
}

function mkfifoPromise(path, perm) {
  return new Promise((resolve, reject) => {
    mkfifo(path, perm, (err) => {
      if (err) return reject(err);
      else return resolve();
    });
  });
}

module.exports = {
  mkfifo: mkfifo,
  mkfifoSync: mkfifoSync,
  mkfifoPromise: mkfifoPromise
};
