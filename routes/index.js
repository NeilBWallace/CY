var express = require('express');
var router = express.Router();
var path = require('path');

var async = require('async');

let Hobby=require('../models/hobby');

let AddHobby=require('../models/addhobby');
let Friends=require('../models/friends');
let Group=require('../models/group');
let User=require('../models/user');
let Challenges=require('../models/challenges');
const multer = require('multer');
const ZiggeoSdk = require ('ziggeo');



// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
   filename: function(req, file, cb){
     cb(null,req.user.username + path.extname(file.originalname));
  
  
  }
  });
  
ZiggeoSdk.init ('r1e4a85dd1e7c33391c1514d6803b975', 'r19a0428a61b2f9b20a871f3652f6cc0')


function home_page(req,res){


    Friends.find({"friend":req.user.username},function(err,fr)
    {
        Challenges.find({},function(err,ch)
        {

            console.log("friends" + ch);
            
    console.log("friends" + fr);
    res.render('index',
    {
        pic:req.user.pic,
        username: req.user.username,
        friend_request:fr,
        Challenge:ch
    });
    
});
    });
    
}

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
    
home_page(req,res);
});

router.get('/describe_challenge', ensureAuthenticated, function(req, res){

    res.render('describe_challenge',{
        username:req.user.username,
       
	});
});


router.get('/describe_challenge/:username/', ensureAuthenticated, function(req, res){
	res.render('challenge_someone',{
        username:req.params.username,
		ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',        
		ziggeo_title:req.body.describe_challenge
	});
});


router.post('/challenge_someone', ensureAuthenticated, function(req, res){
    console.log("challenge someone2st" + req.body.title + "sdf");
	res.render('challenge_someone',{
		ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',        
        username:req.user.username,
        title:req.body.title
	});
});

  
router.get('/edit_profile', ensureAuthenticated, function(req, res){
	console.log('edit profile');
	res.render('edit_profile',{
			
	});
});      
   


router.get ('/videos',ensureAuthenticated, function (req, res){
	
	

    ZiggeoSdk.Videos.index ({tags:req.user.username}, {
        success: function (index) {
	              console.log(index);

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
});

router.get ('/video/:videoId', function (req, res){
    var video_id = req.params.videoId
    res.render ('video',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: 'Single video',
        video_id: video_id,
        need_ziggeo: 1
        
    })
})

router.get ('/video/:videoId/stream/:stream_id', function (req, res){
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

router.delete ('/video/:videoId', function (req, res){
    var video_id = req.params.videoId
    ZiggeoSdk.Videos.destroy (video_id, function (data){
        res.send('ok')
    })
})

router.get ('/streams/:videoId', function (req, res){
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


router.get ('/record', function (req, res){
    res.render ('record',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: req.params.video_id,
        need_ziggeo: 1,
          user: req.user
      })

})

router.get ('/upload', function (req, res){
    res.render ('upload',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: 'Upload video',
        need_ziggeo: 1,
       
    })
})

router.get ('/approve', function (req, res){
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

router.post ('/approve/:video_id', function (req, res){
    var video_id = req.params.video_id
    ZiggeoSdk.Videos.update(video_id,{
        approved: true
    }, function (data){
        res.send('ok')
    })
})

router.post ('/reject/:video_id', function (req, res){
    var video_id = req.params.video_id
    ZiggeoSdk.Videos.update(video_id,{
        approved: false
    }, function (data){
        res.send('ok')
    })
})

router.get ('/download-video/:videoId', function (req, res){
    var video_id = req.params.videoId
    ZiggeoSdk.Videos.download_video(video_id, function(data){
        var file_name = 'temp_video/'+video_id+'.mp4';
        Fs.writeFile(file_name, data, function(err){
            res.download(file_name)

        });
    });
})

router.get ('/download-image/:videoId', function (req, res){
    var video_id = req.params.videoId
    ZiggeoSdk.Videos.download_image(video_id, function(data){
        var file_name = 'temp_video/'+video_id+'.jpg';
        Fs.writeFile(file_name, data, function(err){
            res.download(file_name)

        });
    });
})

router.get ('/error/:errorId*?', function (req, res){
    var error_id = req.params.errorId
    var message = errorDecode(error_id)
    
    res.render ('error', {
        page_title: 'Error',
        message: message,
        need_ziggeo: 0
    })
})
router.get ('/admin', function (req, res){
     
    res.render ('Admin', {
    })
});



router.get ('/find_friends/:id', function (req, res){
	var id = req.params.id;
	
		console.log('Friend request sent' + id);
		
		var friend = new Friends({
			user: req.user.username,
			friend: req.params.id,
			status:"is requesting to be your friend!"
		}).save(function(err) {
           if(err)
           {
            console.log('problem here friend request' + err);
           }else
           {
            console.log('Saved ok');
            
           }
		});
});

router.get ('/send_friends', function (req, res){
	
		console.log('Find friends');
		
				User.find(function(err, arrayOfUsers) {
				   console.log('users' + arrayOfUsers)
				
					res.render('find_friends', {
						friends: arrayOfUsers
					});
				});
			});

            router.get ('/challenge_this_friend/:id/:friend', function (req, res)
                
          {
         
        console.log('challengr this friend' + req.params.id + req.params.friend + 'kkk') ;
        var id = req.params.id;
        
             
            var challenge = new Challenges({
                challenger: req.user.username,
                friend: req.params.friend,
                id: req.params.friend,
                status:"Challenge made"
            }).save(function(err) {
               if(err)
               {
                console.log('problem here friend request' + err);
                challengefriend(req,res);
               }else
               {
                console.log('Saved ok');
                challengefriend(req,res);                     
               }
            });
    });
    
    
    
    
       
function challengefriend(req,res){
    
    Friends.find({"friend":req.user.username},function(err,fr)
    {
    console.log("friends" + fr);
    res.render('challenge_friend',
    {
        id:req.params.id,
        title:req.params.title,
        user:req.params.user,
        friend_request:fr
    });
        });
};


            
            router.get ('/challenge_friend/:id/:title/:user', function (req, res){
                
                    console.log('challenge friends' + req.params.id + req.params.title + req.params.user + "sdfsd");
                      challengefriend(req,res);    
                    });


            router.get ('/challenge/:title/:token/:user', function (req, res){
                
                    console.log('challenge' + req.params.title + req.params.token + req.params.user);
                    
                                res.render('challenge', {
                                       title: req.params.title,
                                       token: req.params.token,
                                       user: req.params.user
                                 });
                        
                        });

router.get ('/accept_challenge/:user/:id', function (req, res){
                            
                                console.log('accept Challenge' + req.params.user + 'sdf' + req.params.id) ;
                            Challenges.findOne({_id: req.params.id},function(err,foundObject)
                            {
                                    if(err)
                                    {
                                        console.log(err);
                                    }else
                                    {
                                        console.log(foundObject);
                                        foundObject.status="challenge accepted"
                                        foundObject.save(function(err,updatedObject){
                                            if(err){
                                                console.log(err);
                                                res.status(500).send();
                                            }else
                                            {
                                                console.log(updatedObject);
                                              home_page(req,res);
            
                                            }
                                                      });
            
                                    }
                            });
            
            
                     
                                    });






            router.get ('/make_friends/:user/:id', function (req, res){
                
                    console.log('make friends' + req.params.user + 'sdf' + req.params.id) ;
                Friends.findOne({_id: req.params.id},function(err,foundObject)
                {
                        if(err)
                        {
                            console.log(err);
                        }else
                        {
                            console.log(foundObject);
                            foundObject.status="are now friends!"
                            foundObject.save(function(err,updatedObject){
                                if(err){
                                    console.log(err);
                                    res.status(500).send();
                                }else
                                {
                                    console.log(updatedObject);
                                  home_page(req,res);

                                }
                                          });

                        }
                });


         
                        });

function find_friends(res){
	User.find(function(err, arrayOfUsers) {
        console.log('users' + arrayOfUsers)
     
         res.render('find_friends', {
             friends: arrayOfUsers
         });
     });
};

router.get ('/find_friends', function (req, res){
	
		console.log('Find friends');
		find_friends(res);
			
			});

router.get ('/friends', function (req, res){

	console.log('Getting friends');
	
			User.find(function(err, arrayOfUsers) {
			   console.log('users' + arrayOfUsers)
			
				res.render('friends', {
					friends: arrayOfUsers
				});
			});
		});
	

	

router.get('/groups', function(req, res) {
	
console.log('Getting groups');

		Group.find(function(err, arrayOfGroups) {
			res.render('groups', {
				groups: arrayOfGroups
			});
		});
	});

router.get('/hobbies', function(req, res) {
console.log('Getting hobbies');

		Hobby.find(function(err, arrayOfHobbies) {
			res.render('hobbies', {
				hobbies: arrayOfHobbies
			});
		});
	});

    router.get('/my_hobbies/:username/', function(req, res) {    
    console.log('Get my hobbies' + req.user);
            AddHobby.find({user:req.user.username},function(err, arrayOfHobbies) {
                  res.render('my_hobbies', {          
                           username: req.params.username,
                            hobbies: arrayOfHobbies,
                        });
            });
       
        });



    router.get('/add_hobbies/:username/', function(req, res) {
         AddHobby.find({});
    console.log('Getting add hobbies' + req.user);
            Hobby.find(function(err, arrayOfHobbies) {
                  res.render('add_hobbies', {                
                            hobbies: arrayOfHobbies,
                        });
            });
        });



	router.get('/edit_hobby/:id/', function(req, res) {
		
			var id = req.params.id;
		
			Hobby.findOne({
				_id: id
			}, function(err, doc) {
				res.render('edit_hobby', {
					hobbies: doc
				});
			});
		})
		
		
		
		router.post('/update_hobby/:id', function(req, res) {
			var id = req.params.id;
			Hobby.findById(id, function(err, hobby) {
		
		
				hobby.hobby = req.body.updated_hobby
				hobby.save();
		
				return res.redirect('/hobbies');
		
			});
		
		
		})
		
		
		router.get('/delete_hobby/:id', function(req, res) {
			Hobby.findById(req.params.id, function(err, hobby) {
				if (!err) {
		
					hobby.remove();
		
		
				} else {
					return err
				}
			});
			return res.redirect('/hobbies');
		})
		
		
		
		
		
		
		



	router.post('/groups', function(req, res) {
		
			var group = new Group({
				group: req.body.group
			}).save(function(err) {
	              console.log('problem here group');
				//______________________________|BEGIN
				Group.find(function(err, toGroup) {
		
					groups: toGroup
		
				});
				//______________________________|END
		
				res.redirect('/groups');
		
			});
		
		});


        router.get('/join_hobby/:id', function(req, res) {
            
                var hobby = new AddHobby({
                    user: req.user.username,
                    hobby: req.params.id
                }).save(function(err) {
                      console.log('problem here hobby');
                    //______________________________|BEGIN
                    Hobby.find(function(err, toHobby) {
            
                        hobbies: toHobby
            
                    });
                    //______________________________|END
            
                    res.redirect('/my_hobbies/:username/');
            
                });
            
            });
    



	router.post('/hobbies', function(req, res) {
		
			var hobby = new Hobby({
				hobby: req.body.hobby
			}).save(function(err) {
	              console.log('problem here hobby');
				//______________________________|BEGIN
				Hobby.find(function(err, toHobby) {
		
					hobbies: toHobby
		
				});
				//______________________________|END
		
				res.redirect('/hobbies');
		
			});
		
		});

router.get ('/users', function (req, res){
	
   res.render ('Users', {
   })
});

router.get ('/challenges', function (req, res){
	
   res.render ('Challenges', {
   })
});



router.get ('/success/:successId*?', function (req, res){
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
  



router.post('/upload_pic', (req, res) => {
console.log('attempting upload');  
    upload(req, res, (err) => {
      if(err){
        res.render('index', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('edit_profile', {
            msg: 'Error: No File Selected!'
          });
        } else {

            User.findOne({_id: req.user._id},function(err,foundObject)
            {
                    if(err)
                    {
                        console.log(err);
                    }else
                    {
                        console.log(foundObject);
                        foundObject.pic=req.file.filename
                        foundObject.save(function(err,updatedObject){
                            if(err){
                                console.log(err);
                                res.status(500).send();
                            }else
                            {
                                console.log(updatedObject);
                      
                            }
                                      });

                    }
            });




          res.render('edit_profile', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });
  






function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}



module.exports = router;