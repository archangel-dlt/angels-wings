const baseProtocol = window.location.protocol;
const baseUrl = window.location.origin;
const baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

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


const images = $('img').map(function(){
	const element = $(this);
	const src = absolutiseImageSrc(element);

	if (!src)
		return null;

	return {
		element: element,
		src: src
	};
}).get()

console.log(images);

images.forEach(image => {
	image.element.wrap("<div class='archangel-authenticated'></div>");
});
