import ArchangelEthereumDriver from './driver/ArchangelEthereumDriver';
import path from 'path';
import fs from 'fs';
const fsp = fs.promises;

const ArchangelNetworkUrl = 'https://blockchain.surrey.ac.uk/ethereum';
let angelsWings = null;
const fingerprintPath = path.join('/tmp', 'fingerprints');

function setupDirectory() {
  if (!fs.existsSync(fingerprintPath))
    fs.mkdirSync(fingerprintPath);
}

function saveFingerprint(payload) {
  const fileName = `photo-${payload.blockNumber}-${payload.txIndex}.json`;
  const filePath = path.join(fingerprintPath, fileName);

  fsp.writeFile(filePath, JSON.stringify(payload));
  console.log(`Written ${fileName}`);
}

function StartAngelsWings() {
  setupDirectory();

  angelsWings = new ArchangelEthereumDriver(
    ArchangelNetworkUrl,
    saveFingerprint
  );
}

export default StartAngelsWings;
