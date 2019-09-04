const baseProtocol = window.location.protocol;
const baseUrl = window.location.origin;
const baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

const AuthenticatedClass = 'archangel-authenticated';
const AuthenticatedInexactClass = 'archangel-authenticated-inexact';
const NotAuthenticatedClass = 'archangel-not-authenticated';
const AuthenticatedWrapper = `<div class='${AuthenticatedClass}'></div>`;
const AuthenticatedInexactWrapper = `<div class='${AuthenticatedInexactClass}'></div>`;
const NotAuthenticatedWrapper = `<div class='${NotAuthenticatedClass}'></div>`

jQuery.noConflict();
angelsWings();

function angelsWings() {
  jQuery(window).on("load", () => {
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
    data => {
      markImage(
        image,
        data.authentic,
        data.exact,
        data.payload ? data.payload.data : null
      );
    }
  );
}

function markImage(image, isAuthentic, isExact, data) {
  if (isAuthentic == 'error')
    return;

  // where the image is wrapped in a div and is the sole child,
  // modify the div style directly - works best on a lot of news sites
  const parent = image.element.parent();
  if (parent.is("picture")) {  // The Guardian!
    const grandparent = parent.parent();
    if (grandparent.children().length == 1)
      style(grandparent, isAuthentic, isExact, data);
    return;
  }

  if ((parent.is("div") && parent.children().length == 1)) {
    style(parent, isAuthentic, isExact, data);
    return;
  }

  wrap(image.element, isAuthentic, isExact, data);
}

function style(elem, isAuthentic, isExact, data) {
  let cls = NotAuthenticatedClass;
  if (isAuthentic)
    cls = isExact ? AuthenticatedClass : AuthenticatedInexactClass;

  elem.addClass(cls);
  addPopup(elem, isAuthentic, isExact, data);
}

function wrap(elem, isAuthentic, isExact, data) {
  let cls = NotAuthenticatedWrapper;
  if (isAuthentic)
    cls = isExact ? AuthenticatedWrapper : AuthenticatedInexactWrapper;
  elem.wrap(cls);
  addPopup(elem.parent(), isAuthentic, isExact, data);
}

function addPopup(elem, isAuthentic, isExact, data) {
  if (!isAuthentic)
    return;

  let popup = isExact ? "" : "Similar to:";
  popup += data.title ? `<br><strong>${data.title}</strong>` : "";
  popup += data.description ? `<br>${data.description}` : "";
  popup += data.supplier ? `<br>From <i>${data.supplier}</i>` : "";
  popup += data.referenceUrl ? `<br><a href="${data.referenceUrl}">${data.referenceUrl}</a>` : "";

  elem
    .append(`<div class="archangel-tag">${popup}</div>`);
  elem
    .mouseover(() => elem.children(".archangel-tag").show())
    .mouseout(() => elem.children(".archangel-tag").hide());
}

function gatherImages() {
	return jQuery('img').map(function() {
		const element = jQuery(this);

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

