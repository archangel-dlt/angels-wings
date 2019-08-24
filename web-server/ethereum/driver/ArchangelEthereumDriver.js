import LZString from 'lz-string';
import Web3 from 'web3';
const ArchangelContract = require('./ethereum/Archangel.json')

const Network = {
  "4": {
    id: 4,
    name: 'Rinkeby',
    fromBlock: 2898300,
    gasLimit: 7000000,
    gasPrice: 10*1e9
  },
  "3151": {
    id: 3151,
    name: 'Archangel-Dev',
    fromBlock: 80380,
    gasLimit: 75000000,
    gasPrice: undefined
  },
  "53419": {
    id: 53419,
    name: 'Archangel User Study',
    fromBlock: 1,
    gasLimit: 83886080,
    gasPrice: 10*1e9
  }
}

const NullId = '0x0000000000000000000000000000000000000000000000000000000000000000';

function unwrapPayload(payload) {
  try {
    return JSON.parse(payload);
  } catch (e) { }

  try {
    const expanded = LZString.decompressFromUTF16(payload);
    return JSON.parse(expanded);
  } catch (e) { }

  throw new Error(`Bad payload : ${payload}`);
}

class ArchangelEthereumDriver {
  get resetEvent() { return "RESET"; }
  static get name() { return "Ethereum"; }

  constructor(web3, eventCallback = () => {}) {
    if (typeof web3 === 'string') {
      const provider = new Web3.providers.HttpProvider(web3);
      web3 = new Web3(provider);
    }
    this.ready = this.setup(web3);

    this.eventCallbacks_ = [ eventCallback ];
  } // constructor

  //////////////////////////////////////////
  async setup(web3) {
    this.web3_ = web3;

    this.grants = { };

    this.network = await ArchangelEthereumDriver.findNetwork(web3);
    console.log(`Using ${this.network.name} network`);

    this.loadContract(this.network.id);

    this.startWatching();
    this.watchRegistrations();
    this.watchGrantPermissions();
  } // setup

  static findNetwork(web3) {
    return new Promise((resolve, reject) => {
      web3.version.getNetwork((err, netId) => {
        if (err)
          return reject(err);
        const network = Network[netId];
        resolve(network);
      })
    });
  } // findNetwork

  get networkName() { return this.network ? this.network.name : 'undetermined'; }
  get fromBlock() { return this.network.fromBlock; }
  get gasLimit() { return this.network.gasLimit; }
  get gasPrice() { return this.network.gasPrice; }

  loadContract(networkId) {
    const contractClass = this.web3_.eth.contract(ArchangelContract.abi);
    this.contract_ = contractClass.at(ArchangelContract.networks[networkId].address);
  } // loadContract

  watchEvents(callback) {
    this.eventCallbacks_.push(callback);
  } // watchEvents

  startWatching() {
    this.watcher_ = this.contract_.allEvents(
      { fromBlock: this.fromBlock },
      // eslint-disable-next-line
      (err, event) => this.eventCallbacks_.forEach(fn => fn(event))
    );
  } // startWatching

  watchRegistrations() {
    stopWatching(this.registrations, 'Registration');
    stopWatching(this.updates, 'Updates');

    this.registrations = this.contract_.Registration(
      { },
      { fromBlock: this.fromBlock },
      () => { }
    );
    this.updates = this.contract_.Update(
      { },
      { fromBlock: this.fromBlock },
      () => { }
    );
  } // watchRegistrations

  watchGrantPermissions() {
    stopWatching(this.grantsWatcher, 'GrantPermission')

    this.grantsWatcher = this.contract_.PermissionGranted(
      { },
      { fromBlock: this.fromBlock },
      // eslint-disable-next-line
      (err, evt) => {
        if (evt) this.grants[evt.args._addr] = evt.args._name
      }
    );
  } // watchGrantPermissions

  ////////////////////////////////////////////
  addressName(addr) {
    const name = this.grants[addr]
    return name ? name : 'unknown'
  } // addressName

  ////////////////////////////////////////////
  recordLog(watcher) {
    return new Promise((resolve, reject) => {
      watcher.get((error, logs) => {
        if (error)
          return reject(error);

        const payloads = logs
          .map(l => { l.uploader = this.addressName(l.args._addr); return l; })
          .map(l => {
            const p = unwrapPayload(l.args._payload);
            p.key = l.args._key;
            p.addr = l.args._addr;
            p.uploader = l.uploader;
            return p;
          })
          .filter(p => p.data && (p.data.pack === 'photo'));

        return resolve(payloads);
      })
    });
  } // watcher

  async registrationLog() {
    const registrations = await this.recordLog(this.registrations);
    const updates = await this.recordLog(this.updates);

    registrations.push(...updates);

    return registrations;
  } // registrationLog

  currentBlockNumber() {
    return new Promise((resolve, reject) => {
      this.web3_.eth.getBlockNumber((err, result) => {
        if(err)
          return reject(err);
        resolve(result);
      })
    })
  } // currentBlockNumber
} // class Ethereum

function stopWatching(watcher, label) {
  try {
    if (watcher)
      watcher.stopWatching()
  } catch (err) {
    console.log(`Problem tearing down ${label} watcher`);
  }
} // stopWatching

export default ArchangelEthereumDriver;
