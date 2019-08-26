import { exec } from 'child_process'
const execp = util.promisify(exec);
import util from 'util';
import path from 'path';

const scriptPath = path.join(__dirname, '../../image-hash/');
const imageHasher = path.join(scriptPath, 'image-hash.py');
const reindexer = path.join(scriptPath, 'build-searchtree.py');

async function fingerprintPhoto(filename) {
  const fingerprintCmd = `${imageHasher} ${filename}`;
  const { stdout } = await execp(fingerprintCmd);
  return JSON.parse(stdout);
}

async function reindexFingerprints(fingerprintPath) {
  const reindexCmd = `${reindexer} ${fingerprintPath}`;
  const {stdout} = await execp(reindexCmd);
  console.log(stdout);
}

export { fingerprintPhoto, reindexFingerprints };
