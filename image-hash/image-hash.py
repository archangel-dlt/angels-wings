#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from extractor import Extractor

if __name__ == '__main__':
  hasher = Extractor()

  img_path = sys.argv[1]
  img_hash = hasher.extract(img_path)

  print('[')
  comma = ''
  for h in img_hash:
    print(f'{comma}  {h}', end = '')
    comma = ',\n'
  print('\n]')
