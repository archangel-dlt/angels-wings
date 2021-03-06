import fs from 'fs';
import axios from 'axios';
import path from 'path';
import os from 'os';
import LRU from 'lru-cache';
import { getTempFilename as tempFilename } from 'express-fileupload/lib/utilities';
import { authenticatePhoto } from '../imagehash/authenticate-photo'

const cache = new LRU({
  max: 500,
  maxAge: 60 * 60 * 1000
});

async function authenticate(req, res) {
  const imageUrl = req.query.url;

  if (!imageUrl)
    return res.status(400).send('No file uploaded');

  const imageInfo = cache.get(imageUrl);
  if (imageInfo)
    return res.json(imageInfo);

  let imagePath = null;
  try {
    imagePath = await downloadImage(imageUrl);

    const authInfo = await authenticatePhoto(imagePath);

    cache.set(imageUrl, authInfo);

    res.json(authInfo);
  } catch (e) {
    res.status(500).send(`Authenticating failed: ${e.message}`);
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

export { authenticate };
