window.capitalize = (str) ->
	str = str.toLowerCase().replace(/\b[a-z]/g, (letter)-> 
    return letter.toUpperCase();
	)

window.getParameterByName = (url, name) ->
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  regexS = "[\\?&]" + name + "=([^&#]*)";
  regex = new RegExp(regexS);
  results = regex.exec(url);
  
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));

window.randString = (length) ->
    text = "";
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for num in [0..length]
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;

window.preloadImage = (imgSrc) ->
  preloadedImage = new Image();
  preloadedImage.src = imgSrc