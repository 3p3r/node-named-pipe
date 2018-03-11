const { appendFileSync, unlinkSync } = require('fs');
const { mkfifoPromise } = require('./index');
const path = '/tmp/sample-node-ipc';

/**
 * Open up a shell and execute 'tail -f /tmp/sample-node-ipc'
 * You should see messages posted from this process!
 */

(async () => {
  await mkfifoPromise(path);
  setInterval(
    appendFileSync.bind(
      null,
      path,
      `${new Date().toISOString()}: hello fron Node!\n`
    ),
    1000
  );
})();

function cleanup(options) {
  if (options.cleanup) unlinkSync(path);
  if (options.exit) process.exit();
}

process.on('exit', cleanup.bind(null, { cleanup: true }));
process.on('SIGINT', cleanup.bind(null, { exit: true }));
