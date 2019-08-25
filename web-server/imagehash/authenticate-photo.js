import { listFingerprints } from '../hashDB/AngelsWings'

async function authenticatePhoto(fingerprint) {
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
  for (let i = 0; i !== lhs.length; ++i)
    if (lhs[i] !== rhs[i])
      return false;
  return true;
}

export { authenticatePhoto };
