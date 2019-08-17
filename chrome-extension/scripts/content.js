const baseProtocol = window.location.protocol;
const baseUrl = window.location.origin;
const baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

const Authenticated = "<div class='archangel-authenticated'></div>";
const NotAuthenticated = "<div class='archangel-not-authenticated'></div>";

angelsWings();

function angelsWings() {
  $(window).on("load", () => {
    const images = gatherImages();
    authenticateImages(images);
  });
} // angelsWings

////////////////////////////////
function authenticateImages(images) {
  images.forEach(authenticateImage)
}

function authenticateImage(image) {
  chrome.runtime.sendMessage(
    image.src,
    function (data) {
      image.data = data;
      markImage(image, data.authentic);
    }
  );
}

function markImage(image, isAuthentic) {
  if (isAuthentic == 'error')
    return;

  image.element.wrap(isAuthentic
    ? Authenticated
    : NotAuthenticated
  );
}

function gatherImages() {
	return $('img').map(function() {
		const element = $(this);

		if (isTooSmall(element))
		  return;

		const src = absolutiseImageSrc(element);

		if (!src)
			return null;

		return {
			element: element,
			src: src
		};
	}).get()
}

function isTooSmall(image) {
  return (image.width() < 100) || (image.height() < 100);
}

function absolutiseImageSrc(image) {
	const src = image.attr('src');
	if (!src)
		return;

	// embedded images - ignore
	if (src.startsWith('data:'))
		return null;

	// relative URLs
	if (src.startsWith('//'))
		return baseProtocol + src;
	if (src.startsWith('/'))
		return baseUrl + src;
	if (src.indexOf('://') === -1)
		return baseLocation + src;

	return src;
}

