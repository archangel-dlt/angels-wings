//const awURL = "http://localhost:3000/authenticate";
const awURL = "https://blockchain.surrey.ac.uk/angelwings/authenticate";

let inflight = 0;
const queued = [];

chrome.runtime.onMessage.addListener(
  (imageUrl, sender, sendResponse) => {
    authenticateImage(imageUrl, sendResponse);
    return true;
  }
)

function authenticateImage(imageUrl, sendResponse) {
  ++inflight;
  sendResponse = shimResponse(sendResponse)
  if (inflight > 3) {
    queued.push([imageUrl, sendResponse]);
    return;
  }

  doAuthenticateImage(imageUrl, sendResponse);
}

function shimResponse(sendResponse) {
  return data => {
    sendResponse(data);

    if (queued.length != 0) {
      const [imageUrl, sendResponse] = queued.shift();
      doAuthenticateImage(imageUrl, sendResponse);
    }
    --inflight;
  }
}


async function doAuthenticateImage(imageUrl, sendResponse) {
  try {
    const response = await fetch(`${awURL}?url=${encodeURIComponent(imageUrl)}`);
    const data = await response.json();

    sendResponse(data);
  } catch (err) {
    sendResponse({authentic: 'error'});
  }
}
