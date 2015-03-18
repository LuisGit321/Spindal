function encodeImage(file, mime) {  
  var canvas = document.createElement("canvas");  
  var ctx = canvas.getContext("2d");  

  var canvasCopy = document.createElement("canvas");  
  var ctxCopy = canvasCopy.getContext("2d");  

  var reader = new FileReader();  
  reader.onload = function() {  
      var image = new Image();  
      image.onload = function() {  
          //copy  
          canvas.width = image.width;  
          canvas.height = image.height;  
          ctx.drawImage(image, 0, 0);  
      
          //convert into image and get as binary base64 encoded  
          //to pass through postMessage  
          var url = canvas.toDataURL(mime, 0.80);  
          uploadImage(file, url)  
      }  

      image.src = reader.result;  
  };  

  //read contents  
  reader.readAsDataURL(file);  
} 