const chai = require('chai');
const tea = require('chai-as-promised');
const { execSync } = require('child_process');
const { existsSync, statSync } = require('fs');
const { mkfifo, mkfifoSync, mkfifoPromise } = require('./index');
chai.use(tea);

const SYNC_PIPE = '/tmp/test-sync-pipe';
const ASYNC_PIPE = '/tmp/test-async-pipe';

describe('named pipe tests', () => {
  beforeEach(cleanup);

  it('should always pass (sanity test)', () => {
    chai.expect(true).to.be.true;
  });

  it('should throw if permission is non-number', () => {
    chai.assert.throws(mkfifo.bind(null, ASYNC_PIPE, 'invalid'));
    chai.assert.throws(mkfifoSync.bind(null, SYNC_PIPE, 'invalid'));
  });

  it('should throw if async callback is empty', () => {
    chai.assert.throws(mkfifo.bind(null, ASYNC_PIPE, 644));
  });

  it('should throw if unable to create the pipe sync', () => {
    chai.assert.throws(mkfifoSync.bind(null, '/root', 644));
  });

  it('should pass error to callback if unable to create the pipe async', done => {
    mkfifo('/root', 644, function(err) {
      chai.assert.isNotNull(err);
      done();
    });
  });

  it('should have default 644 permission (async)', done => {
    mkfifo(ASYNC_PIPE, undefined, function(err) {
      chai.assert.isNull(err);
      chai.assert.equal(0777 & statSync(ASYNC_PIPE).mode, parseInt('0644', 8));
      done();
    });
  });

  it('should have default 644 permission (sync)', () => {
    mkfifoSync(SYNC_PIPE);
    chai.assert.equal(0777 & statSync(SYNC_PIPE).mode, parseInt('0644', 8));
  });

  it('should create the pipe with correct permissions', () => {
    chai.assert.doesNotThrow(mkfifoSync.bind(null, SYNC_PIPE, 600));
    chai.assert.equal(0777 & statSync(SYNC_PIPE).mode, parseInt('0600', 8));
    chai.assert.notEqual(0777 & statSync(SYNC_PIPE).mode, parseInt('0644', 8));
  });

  it('should reject the promise on error and resolve on success', async () => {
    await chai.assert.isRejected(mkfifoPromise('/root'));
    await chai.assert.isFulfilled(mkfifoPromise(ASYNC_PIPE));
  });

  afterEach(cleanup);
});

function cleanup() {
  execSync(`rm -rf ${SYNC_PIPE} ${ASYNC_PIPE}`);
  chai.assert.isFalse(existsSync(ASYNC_PIPE));
  chai.assert.isFalse(existsSync(SYNC_PIPE));
}
