import { exec } from 'child_process'
const execp = util.promisify(exec);
import util from 'util';
import path from 'path';

const imageHasher = path.join(__dirname, '../../image-hash/image-hash.py');

async function fingerprintPhoto(filename) {
  const fingerprintCmd = `${imageHasher} ${filename}`;
  const { stdout } = await execp(fingerprintCmd);
  return JSON.parse(stdout);
}

export { fingerprintPhoto };
