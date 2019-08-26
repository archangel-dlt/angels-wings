import { listFingerprints } from '../hashDB/AngelsWings'
import { fingerprintPhoto } from './fingerprint-photo'

async function authenticatePhoto(imagePath) {
  const fingerprint = await fingerprintPhoto(imagePath);

  for await (const fp of listFingerprints()) {
    if (fingerprintMatch(fingerprint, fp.payload.fingerprint)) {
      fp.authentic = true;
      fp.payload.fingerprint = null;
      return fp;
    }
  } // for ...

  return { authentic: false };
} // authenticatePhoto

function fingerprintMatch(lhs, rhs) {
  for (let i = 0; i !== lhs.hash.length; ++i)
    if (lhs.hash[i] !== rhs.hash[i])
      return false;
  return true;
}

export { authenticatePhoto };
