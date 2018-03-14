String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

var thePanelElement = document.querySelector('skit-panel');
var theContent = thePanelElement.outerHTML;

theContent = theContent.replaceAll('assets/video.mp4', 'xxxxx');
theContent = theContent.replaceAll('assets/video-1.mp4', 'xxxxx');
theContent = theContent.replaceAll('assets/video-2.mp4', 'xxxxx');
theContent = theContent.replaceAll('assets/video-3.mp4', 'xxxxx');
theContent = theContent.replaceAll('assets/video-4.mp4', 'xxxxx');

theContent = theContent.replaceAll('assets/img.jpg', 'xxxxx');
theContent = theContent.replaceAll('assets/img-1.jpg', 'xxxxx');
theContent = theContent.replaceAll('assets/img-2.jpg', 'xxxxx');
theContent = theContent.replaceAll('assets/img-3.jpg', 'xxxxx');
theContent = theContent.replaceAll('assets/img-4.jpg', 'xxxxx');

thePanelElement.outerHTML = theContent;
