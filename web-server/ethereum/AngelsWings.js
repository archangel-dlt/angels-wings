import ArchangelEthereumDriver from './driver/ArchangelEthereumDriver';
const ArchangelNetworkUrl = 'https://blockchain.surrey.ac.uk/ethereum';

let angelsWings = null;

function StartAngelsWings() {
  angelsWings = new ArchangelEthereumDriver(
    ArchangelNetworkUrl,
    console.log
  );
}

export default StartAngelsWings;
