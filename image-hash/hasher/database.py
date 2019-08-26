from os import listdir
from os.path import join, isfile
import json

class JsonFilesReader(object):
  def __init__(self, fingerprintPath):
    self.fingerprintPath = fingerprintPath

  def get_hashes(self):
    return self.load_fingerprint_data('hash')

  def get_thresholds(self):
    return self.load_fingerprint_data('threshold')

  def load_fingerprint_data(self, key):
    data = []
    for filePath in self.fingerprintFiles():
      with open(filePath, 'r') as f:
        fingerprint = json.load(f)['payload']['fingerprint']
        data.append(fingerprint[key])
    return data

  def fingerprintFiles(self):
    everything = [join(self.fingerprintPath, f) for f in sorted(listdir(self.fingerprintPath))]
    files = [f for f in everything if isfile(join(self.fingerprintPath, f))]
    return [f for f in files if f.endswith('.json')]

