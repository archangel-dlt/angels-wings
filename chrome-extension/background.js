const awURL = "http://localhost:3000/authenticate";

chrome.runtime.onMessage.addListener(
  (imageUrl, sender, sendResponse) => {
    authenticateImage(imageUrl, sendResponse);
    return true;
  }
)

async function authenticateImage(imageUrl, sendResponse) {
  try {
    const response = await fetch(`${awURL}?url=${imageUrl}`);
    const data = await response.json();

    sendResponse(data);
  } catch (err) {
    sendResponse({authentic: 'error'});
  }
}
