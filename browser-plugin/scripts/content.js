const baseProtocol = window.location.protocol;
const baseUrl = window.location.origin;
const baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

function absolutiseImageSrc(image) {
	var src = $(image).attr('src');
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
	const src = absolutiseImageSrc(this);
	return src;
}).get()

console.log("Shout out to my boys");
console.log(images);
console.log("Laters");
