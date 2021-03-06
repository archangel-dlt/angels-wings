import ArchangelEthereumDriver from '../driver/ArchangelEthereumDriver';
import Web3 from 'web3';

const hasMetaMask = (typeof window.web3 !== 'undefined') &&
  ((window.web3.currentProvider.constructor.name.startsWith('Metamask') ||
    (window.web3.currentProvider.constructor.toString().indexOf('MetaMask') !== -1)));
const hasMist = (typeof window.web3 !== 'undefined') &&
  (window.web3.currentProvider.constructor.name.startsWith('EthereumProvider'));

async function enableMetaMask(){
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      return window.web3.currentProvider;
    } catch (error) {
      console.log("Access denied to metamask accounts:", error);
    }
  }
}

async function ethereumProviders() {
  const p = []

  if (hasMetaMask) {
    const provider = await enableMetaMask();
    p.push({name: 'MetaMask', provider: provider});
  }
  if (hasMist)
    p.push({name: 'Mist', provider: window.web3.currentProvider});
  p.push({name: 'Localhost', provider: new Web3.providers.HttpProvider('http://localhost:8545')});
  p.push({name: 'Archangel', provider: new Web3.providers.HttpProvider('https://blockchain.surrey.ac.uk/ethereum/')});

  return p;
} // ethereumProviders

class ArchangelProvider extends ArchangelEthereumDriver {
  constructor(providers) {
    super(new Web3(providers[0].provider));
    this.providers_ = providers
  } // constructor

  onProviderChange(key) {
    const provider = this.providers_.filter(p => p.name === key)[0].provider;
    return this.setup(new Web3(provider))
  } // onProviderChange

  get metaMaskAvailable() { return hasMetaMask }
  get mistAvailable() { return hasMist }
  get providers() { return this.providers_ }
} // class ArchangelProvider

async function ArchangelDriver() {
  const providers = await ethereumProviders();
  return new ArchangelProvider(providers);
} // ArchangelDriver

export default ArchangelDriver
