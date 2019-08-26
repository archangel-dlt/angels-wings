import ArchangelEthereumDriver from './driver/ArchangelEthereumDriver';
import path from 'path';
import fs from 'fs';
const fsp = fs.promises;
import { Indexer } from './indexer'

const ArchangelNetworkUrl = 'https://blockchain.surrey.ac.uk/ethereum';
let angelsWings = null;
const fingerprintPath = path.join('/tmp', 'fingerprints');
const indexer = new Indexer(fingerprintPath);

async function setupDirectory() {
  if (!fs.existsSync(fingerprintPath)) {
    fs.mkdirSync(fingerprintPath);
    return;
  }
  // clear down so we can repopulate
  const filePaths = await listFingerprintFiles();
  return Promise.all(filePaths.map(p => fsp.unlink(p)));
}

function saveFingerprint(payload) {
  const fileName = `photo-${payload.blockNumber}-${payload.txIndex}.json`;
  const filePath = path.join(fingerprintPath, fileName);

  fsp.writeFile(filePath, JSON.stringify(payload));
  indexer.trigger();
}

async function listFingerprintFiles() {
  const fileNames = await fsp.readdir(fingerprintPath);
  return fileNames.map(
    name => path.join(fingerprintPath, name)
  );
}

async function* listFingerprints() {
  const filePaths = await listFingerprintFiles();
  for (const path of filePaths) {
    const fingerprint = await fsp.readFile(path);
    yield JSON.parse(fingerprint);
  }
}

async function StartAngelsWings() {
  await setupDirectory();

  angelsWings = new ArchangelEthereumDriver(
    ArchangelNetworkUrl,
    saveFingerprint
  );
}

export { StartAngelsWings, listFingerprints }
