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
var expressValidator = require('express-validator');
var router = express.Router(); 
var LocalStrategy = require('passport-local').Strategy; 
var flash = require('connect-flash');

 
 // Express Validator 
 app.use(expressValidator({ 
   errorFormatter: function(param, msg, value) { 
       var namespace = param.split('.') 
       , root    = namespace.shift() 
       , formParam = root; 
 
 
     while(namespace.length) { 
       formParam += '[' + namespace.shift() + ']'; 
     } 
     return { 
       param : formParam, 
       msg   : msg, 
       value : value 
     }; 
   } 
 })); 

  
app.use(flash()); 
  
  
 



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

var User = require('./app/models/user');
let UserDetails=require('./app/models/userdetails');
let Group=require('./app/models/group');
let Hobby=require('./app/models/hobby');
// normal routes ===============================================================

    //show the home page (will also have our login links)
   app.get('/', ensureAuthenticated,function(req, res) {
            {
                res.render('home.ejs', {
                    user: req.user,
                    page_title: 'Challenge You',
                    need_ziggeo: 0,
                    ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',  
                    file:"/uploads/myImage.jpg",    
                       });
           
        
            } 
        });

        function ensureAuthenticated(req, res, next){
            if(req.isAuthenticated()){
                return next();
            } else {
                //req.flash('error_msg','You are not logged in');
                res.redirect('/login');
            }
        }
           
            
   



    app.get('/groups',function(req,res){
        Group.find({},function(err,groups){
            if(err)
            {
                console.log('errror retrieving groups')
            }else
            {
               console.log(groups);
               
               res.render('groups',
               {
                ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',      
                   user: req.user,
                   page_title: 'Groups',
                   group:groups,
                   need_ziggeo: 1
                   
               }
               );
            }
       
   });
});
    
app.get('/user_image_upload',function(req,res){
            
           res.render('user_image_upload',
           {
              file:"/uploads/myImage.jpg",
              need_ziggeo: 1,
              ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
              
           });
    
});

app.get('/challenge_id',function(req,res){
    
});


app.get('/challenge_someone',function(req,res){
    UserDetails.find({},function(err,userdetails){
    
        if(err)
        {
            console.log('errror retrieving user details')
        }else
        {
           console.log(userdetails);
           
           res.render('challenge_someone',
           {
            ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',        
               user: req.user,
               page_title: 'USer Detials',
               userdetail:userdetails,
               need_ziggeo: 1,           
           }
           );
           }
         } );
        
   
});

app.get('/delete_user/:id',function(req,res){
    let query = {_id:req.params.id};
    UserDetails.remove(query);
});

app.get('/user_details',function(req,res){
   UserDetails.find({email:req.user.local.email},function(err,userdetails){
        if(err)
        {
            console.log('errror retrieving user details')
        }else
        {
           console.log('email' + req.user.local.email + 'user details' +userdetails);
          var un; 
           for(var i =0; i < userdetails.length; i++){ 
            
                un =userdetails[i].username
            
        }



           res.render('user_details',
           {
            need_ziggeo: 1,
            ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',           
               user: req.user,
               page_title: 'User Detials',
               username:un ,
               msg:err         
           }
           );
        }
   
});
});



app.post('/insert_userdetails/:id',function(req,res){
    
               // create the user
 let newUserDetails   = new UserDetails();
   newUserDetails.email = req.params.id;
   console.log("email:" + req.params.id);            
   newUserDetails.username   = req.body.userdetail;
 newUserDetails.save(function(err){
   if(err){
    console.log(err);
    res.render('user_details',
    {
     need_ziggeo: 1,
     ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',           
        user: req.user,
        page_title: 'User Detials',
        username:req.body.userdetail,    
        msg:err.errmsg       
    });

    
       
   }else
   {
       res.redirect('/user_details');
   }
 });
});                    



app.post('/insert_group',function(req,res){
    
               // create the user
 let newGroup   = new Group();
               
   newGroup.group   = req.body.group;
   console.log(req.body.group);
 newGroup.save(function(err){
   if(err){
       console.log(err);
       return
   }else
   {
       res.redirect('/groups');
   }
 });
                        



});






    app.get('/hobbies',function(req,res){


        
         Hobby.find({},function(err,hobbies){
             if(err)
             {
                 console.log('errror retrieving hobbies')
             }else
             {
                console.log(hobbies);
                
                res.render('hobbies',
                {
                    need_ziggeo: 1,           
                    user: req.user,
                    page_title: 'Hobbies',
                    hobby:hobbies,
                    ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
                    
                }
                );
             }
        
    });
});

    app.post('/insert_hobby',function(req,res){
       
                  // create the user
    let newHobby   = new Hobby();
                  
      newHobby.hobby    = req.body.hobby;
      console.log(req.body.hobby);
    newHobby.save(function(err){
      if(err){
        Hobby.find({},function(err,hobbies){
            if(err)
            {
                console.log('errror retrieving hobbies')
            }else
            {
               console.log(hobbies);
               
               res.render('hobbies',
               {
                need_ziggeo: 1,       
                ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
                
                   user: req.user,
                   page_title: 'Try again',
                   hobby:hobbies,
                  msg:"Invalid entry try again"
               }
               );
            }
       
   });
        
      }else
      {
          res.redirect('/hobbies');
      }
    });
                           



});

  

    app.post('/update_hobby',function(req,res){
        res.render('hobbies',
    {
        user: req.user,
        page_title: 'Hobbies',
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        
    }
    );
    });


    app.post('/delete_hobby',function(req,res){
        res.render('hobbies',
    {
        user: req.user,
        page_title: 'Hobbies',

    }
    );
    });


    // PROFILE SECTION =========================
 //   app.get('/profile', function(req, res) {
 //         UserDetails.find({email:req.user.local.email},function(err,userdetails){
 //           console.log(userdetails);
            
  //          if(userdetails.length)
  //          {
  //              res.render('home.ejs', {
  //                  user: req.user,
  //                  page_title: 'Challenge You',
  //                  need_ziggeo: 0,
  //                  ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',  
  //                  file:"/uploads/myImage.jpg",    
  //                   message: req.flash('loginMessage') 
  //                  });
   //            }else
     //       {
              
    //                 console.log('email' + req.user.local.email + 'user details' +userdetails);
    //              var un; 
    //               for(var i =0; i < userdetails.length; i++){ 
    //                
    //                    un =userdetails[i].username
                    
        //        }
      //  
        
        
      //             res.render('first_user_details',
      //             {
      //                 user: req.user,
      //                 page_title: 'Please Enter User Detials',
      //                 username:un ,
      //                 msg:err , 
      //                 first:true       
      //             }
      //             );
      //          }
      //      } );
      //  });
    
 


// Register
app.get('/signup', function(req, res){
	res.render('signup');
});

// Login
app.get('/login', function(req, res){
	res.render('login');
});

// Register User
app.post('/signup', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('signup',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

	
		res.redirect('/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

app.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
	req.logout();

	res.redirect('/login');
});


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

