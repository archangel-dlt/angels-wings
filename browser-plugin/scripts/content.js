var baseProtocol = window.location.protocol;
var baseUrl = window.location.origin;
var baseLocation = baseUrl + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1)

var images = $('img').map(function(){
	var src = $(this).attr('src');
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
}).get()

console.log("Shout out to my boys");
console.log(images);
console.log("Laters");
