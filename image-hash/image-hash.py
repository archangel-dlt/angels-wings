#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from hasher.extractor import Extractor

def printHash(img_hash):
  print('[')
  delimiter = ''
  for h in img_hash:
    print(f'{delimiter}  {h}', end = '')
    delimiter = ',\n'
  print('\n]')

def printThreshold(threshold):
  print(threshold)

def printFingerprint(img_hash, threshold):
  print('{')
  print('"hash": ', end='')
  printHash(img_hash)
  print(',')
  print('"threshold": ', end='')
  print(threshold)
  print('}')

if __name__ == '__main__':
  hasher = Extractor()

  img_path = sys.argv[1]
  img_hash, threshold = hasher.extract2(img_path)

  printFingerprint(img_hash, threshold)
