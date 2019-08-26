import { listFingerprintFiles } from '../hashDB/AngelsWings'
import { checkPhoto } from './fingerprint-photo'
import { promises as fsp } from 'fs';

async function authenticatePhoto(imagePath) {
  const result = await checkPhoto(imagePath, '/tmp/fingerprints');

  console.log(result)

  if (!result.found)
    return { authentic: false };

  const fingerprint = await loadFingerprint(result.image);
  fingerprint.authentic = true;
  fingerprint.exact = result.exact;
  fingerprint.distance = result.distance;
  fingerprint.payload.fingerprint = null;
  return fingerprint;
} // authenticatePhoto

async function loadFingerprint(index) {
  const imagePaths = await listFingerprintFiles();
  const fingerprint = await fsp.readFile(imagePaths[index]);
  return JSON.parse(fingerprint);
}

export { authenticatePhoto };
