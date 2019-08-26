#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from os.path import join
import pickle
from hasher.database import JsonFilesReader as DatabaseReader
from hasher.extractor import Extractor

def load_thresholds(fingerprints_path):
  db = DatabaseReader(fingerprints_path)
  return db.get_thresholds()

def load_search_index(index_path):
  with open(index_path, 'rb') as f:
    search = pickle.load(f)
  return search

def hash_image(img_path):
  hasher = Extractor()
  feat, th = hasher.extract2(img_path)
  feat = feat[None, ...]
  return feat

if __name__ == '__main__':
  img_path = sys.argv[1]
  fingerprints_path = sys.argv[2]
  index_path = join(fingerprints_path, 'fingerprint.db')

  ths = load_thresholds(fingerprints_path)
  search = load_search_index(index_path)
  img_hash = hash_image(img_path)

  dist, ids = search.kneighbors(img_hash)
  ids = ids.squeeze()
  dist = dist.squeeze()

  if dist > ths[ids]:
    print('{"found": false}')
  else:
    print('{')
    print('  "found": true,')
    print('  "image": %d,' % ids)
    if (dist == 0.0):
      print('  "exact": true')
    else:
      print('  "exact": false,')
      print('  "distance": %f' % dist)
    print('}')
