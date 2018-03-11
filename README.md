# node-named-pipe

Linux named pipes in NodeJS (mkfifo)

```bash
npm install named-pipe
```

This library creates Linux pipes without the use of a C++ binding and through shell execution.

## Dependencies

None! your shell needs to support `mkfifo` though. Try `mkfifo --help` in a shell and see if you have access to it.

## Cool! what can I do with pipes (a.k.a example code)?

You can use Linux pipes for a very simple RPC. **note that Linux pipes by default will BLOCK if no other process is reading from the other end!**.

In your Node process:

```JS
const path = '/tmp/test';
await mkfifoPromise(path);
setInterval(
  appendFileSync.bind(null, path,
    `${new Date().toISOString()}: hello fron Node!\n`
  ),
  1000
);
```

And in a separate shell:

```bash
$ tail -f /tmp/test
2018-03-11T05:37:16.328Z: hello fron Node!
2018-03-11T05:37:16.328Z: hello fron Node!
...
```

Full source code of this example is located in [example.js](example.js).

## API

This library provides three variants of mkfifo in NodeJS.

### sync

Signature:

```TS
const mkfifoSync: (path: string, permission?: number = 644);
```

Usage:

```JS
const { mkfifoSync } = require('named-pipe');
mkfifoSync('/tmp/fifo');
```

### promise

```TS
const mkfifoPromise: (path: string, permission?: number = 644);
```

Usage:

```JS
const { mkfifoPromise } = require('named-pipe');
await mkfifoPromise('/tmp/fifo').catch(console.error);
```

### async

```TS
const mkfifo: (path: string, permission?: number = 644, callback: Function);
```

Usage:

```JS
const { mkfifo } = require('named-pipe');
mkfifo('/tmp/fifo', 644, (error) => {
  // 'error' will be non-null if unable to create the pipe
});
```
