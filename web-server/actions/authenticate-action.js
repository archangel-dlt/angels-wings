const fs = require('fs');
const axios = require('axios');
const path = require('path');
const os = require('os');
const tempFilename = require('express-fileupload/lib/utilities').getTempFilename;
const fingerprintPhoto = require('../imagehash/fingerprint-photo');

async function authenticate(req, res) {
  const imageUrl = req.query.url;
  if (!imageUrl)
    return res.status(400).send('No file uploaded');

  let imagePath = null;
  try {
    imagePath = await downloadImage(imageUrl);

    const fingerprint = await fingerprintPhoto(imagePath);

    console.log(fingerprint)
    res.json({authentic: false});
  } finally {
    if (imagePath)
      fs.promises.unlink(imagePath);
  }
}

async function downloadImage(imageUrl) {
  const imageFilePath = path.join(os.tmpdir(), tempFilename('aw'));
  const writer = fs.createWriteStream(imageFilePath);

  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })

  return imageFilePath;
}

module.exports = authenticate
