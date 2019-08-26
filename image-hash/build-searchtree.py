#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_searchtree.py
Creat a search model for nearest neighbor search
"""

import sys
from os.path import join
import pickle
from sklearn.neighbors import NearestNeighbors as NN
from hasher.database import JsonFilesReader as DatabaseReader

if __name__ == '__main__':
  fingerprints_path = sys.argv[1]
  index_path = join(fingerprints_path, 'fingerprint.db')

  db = DatabaseReader(fingerprints_path)
  feats = db.get_hashes()
  nbrs = NN(1, algorithm='ball_tree').fit(feats)
  with open(index_path, 'wb') as f:
    pickle.dump(nbrs, f)
  print('Search index saved at %s' % index_path)
