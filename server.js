// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
const multer = require('multer');
var morgan       = require('morgan');
const path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');



// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
   filename: function(req, file, cb){
     cb(null,file.fieldname + path.extname(file.originalname));
 

}
  });


// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  
var configDB = require('./config/database.js');

const ZiggeoSdk = require ('ziggeo');


ZiggeoSdk.init ('r1e4a85dd1e7c33391c1514d6803b975', 'r19a0428a61b2f9b20a871f3652f6cc0')

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.engine ('ejs', require('ejs-locals'));

app.set('view engine', 'ejs'); // set up ejs for templating
app.use( express.static( "public" ) );
// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.post('/upload_image', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('user_image_upload', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('user_image_upload', {
            msg: 'Error: No File Selected!'
          });
        } else {
          res.render('user_image_upload', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });
  

app.get ('/videos', function (req, res){
    
    ZiggeoSdk.Videos.index ({limit:100}, {
        success: function (index) {
            res.render('videos', {
                ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
                page_title: 'Challenge You All Videos',
                need_ziggeo: 1,
                videos: index,
                user: req.user
            })
            return true;
        },
        failure: function (args, error) {
            console.log("failed: " + error);
            renderError(1)
            return false;
        }
    });
})

app.get ('/video/:videoId', function (req, res){
    var video_id = req.params.videoId
    res.render ('video',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: 'Single video',
        video_id: video_id,
        need_ziggeo: 1
        
    })
})

app.get ('/video/:videoId/stream/:stream_id', function (req, res){
    var video_id = req.params.videoId
    var stream_id = req.params.stream_id
    res.render ('stream',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: 'Single stream',
        video_id: video_id,
        stream_id: stream_id,
        need_ziggeo: 1
    })
})

app.delete ('/video/:videoId', function (req, res){
    var video_id = req.params.videoId
    ZiggeoSdk.Videos.destroy (video_id, function (data){
        res.send('ok')
    })
})

app.get ('/streams/:videoId', function (req, res){
    var video_id = req.params.videoId
    ZiggeoSdk.Streams.index(video_id, {states:"ready"}, {
        success: function(index){
            res.render('streams', {
                ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
                page_title: ' Single Streams',
                need_ziggeo: 1,
                video_token: video_id,
                videos: index
            })	
        },
        failure: function(){
            
        }
    })
})


app.get ('/record', function (req, res){
    res.render ('record',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: req.params.video_id,
        need_ziggeo: 1,
          user: req.user
      })

})

app.get ('/upload', function (req, res){
    res.render ('upload',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: 'Upload video',
        need_ziggeo: 1,
       
    })
})

app.get ('/approve', function (req, res){
    ZiggeoSdk.Videos.index ({limit:100}, {
        success: function (index) {
            res.render('approve', {
                ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
                page_title: 'Approve Videos',
                need_ziggeo: 1,
                videos: index
            })
            return true;
        },
        failure: function (args, error) {
            console.log("failed: " + error);
            renderError(1)
            return false;
        }
    });
})

app.post ('/approve/:video_id', function (req, res){
    var video_id = req.params.video_id
    ZiggeoSdk.Videos.update(video_id,{
        approved: true
    }, function (data){
        res.send('ok')
    })
})

app.post ('/reject/:video_id', function (req, res){
    var video_id = req.params.video_id
    ZiggeoSdk.Videos.update(video_id,{
        approved: false
    }, function (data){
        res.send('ok')
    })
})

app.get ('/download-video/:videoId', function (req, res){
    var video_id = req.params.videoId
    ZiggeoSdk.Videos.download_video(video_id, function(data){
        var file_name = 'temp_video/'+video_id+'.mp4';
        Fs.writeFile(file_name, data, function(err){
            res.download(file_name)

        });
    });
})

app.get ('/download-image/:videoId', function (req, res){
    var video_id = req.params.videoId
    ZiggeoSdk.Videos.download_image(video_id, function(data){
        var file_name = 'temp_video/'+video_id+'.jpg';
        Fs.writeFile(file_name, data, function(err){
            res.download(file_name)

        });
    });
})

app.get ('/error/:errorId*?', function (req, res){
    var error_id = req.params.errorId
    var message = errorDecode(error_id)
    
    res.render ('error', {
        page_title: 'Error',
        message: message,
        need_ziggeo: 0
    })
})

app.get ('/success/:successId*?', function (req, res){
    var success_id = req.params.successId
    var message = successDecode(success_id)
    
    res.render ('success', {
        page_title: 'Success',
        message: message,
        need_ziggeo: 0
    })
})

function renderError(error_id){
    App.render ('error', {
        page_title: 'Error',
        message: errorDecode (error_id)
    })
}

function errorDecode (error_id){
    var message = ''
    switch (error_id) {
        case "1":
            message = 'Api key and token are required. Please add it to .env file in root directory.'
        break;
        case "2":
            message = 'There was some error with deleting'
        break;
        default:
            message = ''
        break;
    }
    return message
}

function successDecode (success_id){
    var message = ''
    switch (success_id) {
        case "1":
            message = ''
        break;
        case "2":
            message = 'Video was successfully deleted'
        break;
        default:
            message = ''
        break;
    }
    return message
}








// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

