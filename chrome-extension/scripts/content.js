const baseProtocol = window.location.protocol;
const baseUrl = window.location.origin;
const baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

const Authenticated = "<div class='archangel-authenticated'></div>";
const NotAuthenticated = "<div class='archangel-not-authenticated'></div>";

angelsWings();

async function angelsWings() {
	let images = gatherImages();
	images = await authenticateImages(images);
	console.log(images);
	images.forEach(image => {
		image.element.wrap(image.authentic
			? Authenticated
			: NotAuthenticated
		);
	});
} // angelsWings

////////////////////////////////
async function authenticateImages(images) {
	const l = images.length;
	for (let i = 0; i != l; ++i)
		images[i].authentic = (i%2 === 0);
	return images;
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

