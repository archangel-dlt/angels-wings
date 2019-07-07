var baseProtocol = window.location.protocol;
var baseUrl = window.location.origin;

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

	return src;
}).get()

console.log("Shout out to my boys");
console.log(images);
console.log("Laters");
