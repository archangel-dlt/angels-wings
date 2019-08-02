const fs = require('fs').promises;
const fingerprintPhoto = require('./fingerprint-photo');

function fingerprint(req, res) {
  const photo = req.files.photo;

  try {
    if (!photo.name)
      return res.status(400).send('No file uploaded');

    const fingerprint = fingerprintPhoto(photo.tempFilePath);

    res.send(fingerprint);
  } finally {
    fs.unlink(photo.tempFilePath);
  }
}

module.exports = fingerprint
