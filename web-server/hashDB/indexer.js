import { reindexFingerprints } from '../imagehash/fingerprint-photo';

const reindexTimeout = 5000;

class Indexer {
  constructor(fingerprintPath) {
    this.fingerprintPath = fingerprintPath;
  } // constructor

  trigger() {
    if (this.pending)
      clearTimeout(this.pending);

    this.pending = setTimeout(
      () => this.reindex(),
      reindexTimeout
    );
  } // trigger

  reindex() {
    this.pending = null;
    reindexFingerprints(this.fingerprintPath);
  } // reindex
}

export { Indexer };
