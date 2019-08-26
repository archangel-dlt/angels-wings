from os import listdir
from os.path import join, isfile
import json

class JsonFilesReader(object):
  def __init__(self, fingerprintPath):
    self.fingerprintPath = fingerprintPath

  def get_hashes(self):
    hashes = []
    for filePath in self.fingerprintFiles():
      with open(filePath, 'r') as f:
          fingerprint = json.load(f)['payload']['fingerprint']
          hashes.append(fingerprint['hash'])
    return hashes

  def fingerprintFiles(self):
    everything = [join(self.fingerprintPath, f) for f in listdir(self.fingerprintPath)]
    files = [f for f in everything if isfile(join(self.fingerprintPath, f))]
    return [f for f in files if f.endswith('.json')]

