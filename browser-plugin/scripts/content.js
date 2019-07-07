const baseProtocol = window.location.protocol;
const baseUrl = window.location.origin;
const baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

angelsWings();

async function angelsWings() {
	let images = gatherImages();
	images = await authenticateImages(images);
	console.log(images);
	images.forEach(image => {
		if (image.authentic)
			image.element.wrap("<div class='archangel-authenticated'></div>");
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
		const src = absolutiseImageSrc(element);

		if (!src)
			return null;

		return {
			element: element,
			src: src
		};
	}).get()
}

function absolutiseImageSrc(image) {
	var src = image.attr('src');
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

