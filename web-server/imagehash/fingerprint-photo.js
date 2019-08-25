const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const imageHasher = path.join(__dirname, '../../image-hash/image-hash.py');

async function fingerprintPhoto(filename) {
  const fingerprintCmd = `${imageHasher} ${filename}`;
  const { stdout } = await exec(fingerprintCmd);
  return stdout;
}

module.exports = fingerprintPhoto;
