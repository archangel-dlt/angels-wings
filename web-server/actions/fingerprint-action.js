const fingerprintPhoto = require('./fingerprint-photo');

function fingerprint(req, res) {
  res.send(fingerprintPhoto('cat.jpg'));
}

module.exports = fingerprint
