import { exec } from 'child_process'
const execp = util.promisify(exec);
import util from 'util';
import path from 'path';

const scriptPath = path.join(__dirname, '../../image-hash/');
const imageHasher = path.join(scriptPath, 'image-hash.py');
const reindexer = path.join(scriptPath, 'build-searchtree.py');
const imageChecker = path.join(scriptPath, 'image-checker.py');

async function runScript(script, ...args) {
  const cmd = `${script} ${args.join(' ')}`
  const { stdout } = await execp(cmd);
  return stdout;
}
async function fingerprintPhoto(filename) {
  const fingerprint = await runScript(imageHasher, filename);
  return JSON.parse(fingerprint);
}

function reindexFingerprints(fingerprintPath) {
  runScript(reindexer, fingerprintPath)
    .then(console.log)
}

async function checkPhoto(photoPath, fingerprintPath) {
  const stdout = await runScript(
    imageChecker,
    photoPath,
    fingerprintPath
  );
  return JSON.parse(stdout);
}

export { fingerprintPhoto, reindexFingerprints, checkPhoto };
