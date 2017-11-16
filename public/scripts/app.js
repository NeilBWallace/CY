<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css"/> 
   


var imgPrevie = document.getElementById("img-preview");
var fileUpload =document.getElementById("file-upload");

var cf = "https://api.cloudinary.com/v1_1/dz1wt4zut/upload";
var c_preset ="ebjg6jj2";
fileupload.addEventListener('change',function(event){
var file=event.target.files[0];

var formData = new FormData();
formData.append('file',file);
formData.append('upload_preset',c_preset);
axios({
      url:cf,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
      }).then(function(res){
          console.log(res);
          imgPreview.src=res.data.secure.url;
      }).catch(function(err){
          console.error(err);
      });
});
