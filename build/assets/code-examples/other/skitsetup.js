String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

var thePanelElement = document.querySelector('skit-panel');
var theContent = thePanelElement.outerHTML;

theContent = theContent.replaceAll('assets/video.mp4', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk21qj00ljP_9tzkse36_video1.mp4');
theContent = theContent.replaceAll('assets/video-1.mp4', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk21qj00ljP_9tzkse36_video1.mp4');
theContent = theContent.replaceAll('assets/video-2.mp4', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk2pxp00lkP_nkxfuc89_video2.mp4');
theContent = theContent.replaceAll('assets/video-3.mp4', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk3m1900llP_4p4u0emy_video3.mp4');
theContent = theContent.replaceAll('assets/video-4.mp4', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk45oy00lmP_96t8zjjy_video4.mp4');

theContent = theContent.replaceAll('assets/image.jpg', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerjzrwy00lfP_5e06qujq_forest-lake-national-parks-nature.jpg');
theContent = theContent.replaceAll('assets/image-1.jpg', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerjzrwy00lfP_5e06qujq_forest-lake-national-parks-nature.jpg');
theContent = theContent.replaceAll('assets/image-2.jpg', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk08w800lgP_2z6uneqk_desert-family-travel-national-parks-nature.jpg');
theContent = theContent.replaceAll('assets/image-3.jpg', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk0obl00lhP_kppvelki_great-walks-in-tongariro-national-park-apart-from-the-crossing-.jpg');
theContent = theContent.replaceAll('assets/image-4.jpg', 'https://serve.specless.tech/upload/1/creative/hgsQXC/assets/cjerk146c00liP_4okoczpw_lake-national-parks-nature-sea.jpg');

thePanelElement.outerHTML = theContent;
