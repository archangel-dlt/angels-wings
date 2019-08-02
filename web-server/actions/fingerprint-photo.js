const exec = require('child_process').exec;
const path = require('path');

const imageHasher = path.join(__dirname, '../../image-hash/image-hash.py');

function fingerprintPhoto(filename) {
  return `running ${imageHasher} ${filename}`;
}

module.exports = fingerprintPhoto;
