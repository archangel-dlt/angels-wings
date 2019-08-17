const baseProtocol = window.location.protocol;
const baseUrl = window.location.origin;
const baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

const AuthenticatedClass = 'archangel-authenticated';
const NotAuthenticatedClass = 'archangel-not-authenticated';
const AuthenticatedWrapper = `<div class='${AuthenticatedClass}'></div>`;
const NotAuthenticatedWrapper = `<div class='${NotAuthenticatedClass}'></div>`

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

  // where the image is wrapped in a div and is the sole child,
  // modify the div style directly - works best on a lot of news sites
  const parent = image.element.parent();
  if (parent.is("picture")) {  // The Guardian!
    const grandparent = parent.parent();
    if (grandparent.children().length == 1)
      style(grandparent, isAuthentic);
    return;
  }

  if ((parent.is("div") && parent.children().length == 1)) {
    style(parent, isAuthentic);
    return;
  }

  wrap(image.element, isAuthentic);
}

function style(elem, isAuthentic) {
  elem.addClass(isAuthentic ? AuthenticatedClass : NotAuthenticatedClass);
}

function wrap(elem, isAuthentic) {
  elem.wrap(isAuthentic ? AuthenticatedWrapper : NotAuthenticatedWrapper);
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

