// https://stackoverflow.com/questions/44429173/javascript-encodeuri-failed-to-encode-round-bracket
function superEncodeURI(url) {

    var encodedStr = '', encodeChars = ["(", ")", "}", "{", "<", ">", "?","[", "]",'*', '$'];
    url = encodeURI(url);
  
    for(var i = 0, len = url.length; i < len; i++) {
      if (encodeChars.indexOf(url[i]) >= 0) {
          var hex = parseInt(url.charCodeAt(i)).toString(16);
          encodedStr += '%' + hex;
      }
      else {
          encodedStr += url[i];
      }
    }
  
    return encodedStr;
  }