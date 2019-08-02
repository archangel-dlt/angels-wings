const fs = require('fs').promises;
const fingerprintPhoto = require('./fingerprint-photo');

async function fingerprint(req, res) {
  const photo = req.files.photo;

  try {
    if (!photo.name)
      return res.status(400).send('No file uploaded');

    const fingerprint = await fingerprintPhoto(photo.tempFilePath);

    res.send(fingerprint);
  } catch (e) {
    res.status(500).send(`Fingerprinting failed: ${e.message}`);
  } finally {
    fs.unlink(photo.tempFilePath);
  }
}

module.exports = fingerprint
