


module.exports = function(app, passport) {

//const mongoose=require('mongoose');
//mongoose.connect('mongodb://sa:sa@ds237475.mlab.com:37475/challengeyou');
//let db = mongoose.connection;

//db.once('open',function(){
//console.log('console.db');
//});

//db.on('error',function(){
//console.log(err);
//});
let UserDetails=require('./models/userdetails');
let Group=require('./models/group');
let Hobby=require('./models/hobby');
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/',isLoggedIn, function(req, res) {
    
        res.render('home.ejs', {
            user: req.user,
            page_title: 'Challenge You',
            need_ziggeo: 0,
            ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',  
            file:"/uploads/myImage.jpg",    
             message: req.flash('loginMessage') 
            });
   
    });



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
    app.get('/profile', isLoggedIn, function(req, res) {
   
        res.render('home', {
            user: req.user,
            page_title: 'Challenge You',
            need_ziggeo: 0,
            file:"/uploads/myImage.jpg",
            ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
            
        });


   //     res.render('profile.ejs', {
   //         user : req.user
   //     });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));




// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
  //      app.get('/connect/local', function(req, res) {
  //          res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  //      });
  //      app.post('/connect/local', passport.authenticate('local-signup', {
  //          successRedirect : '/profile', // redirect to the secure profile section
  //          failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
  //          failureFlash : true // allow flash messages
  //      }));




// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
//    app.get('/unlink/local', isLoggedIn, function(req, res) {
//        var user            = req.user;
//        user.local.email    = undefined;
//        user.local.password = undefined;
//        user.save(function(err) {
//            res.redirect('/profile');
//        });
//    });





   



};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
