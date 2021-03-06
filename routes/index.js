var express = require('express');
var router = express.Router();
var path = require('path');

var async = require('async');

let Hobby=require('../models/hobby');
let Friends=require('../models/friends');
let Group=require('../models/group');
let User=require('../models/user');
let Challenge=require('../models/challenge');
let c=require('../models/c');
const multer = require('multer');
//const ZiggeoSdk = require ('ziggeo');




  
//ZiggeoSdk.init ('r1e4a85dd1e7c33391c1514d6803b975', 'r19a0428a61b2f9b20a871f3652f6cc0')


function edit_profile(req,res){
  Group.find(function(err, arrayOfGroups) {
    Hobby.find(function(err, arrayOfHobbies) {
        
	res.render('edit_profile',{
        location:req.session.location,
        username:req.user.username,
       user: req.user,
       Challenge:req.session.challenges,
       pic:req.session.pic,
       friend_request:req.session.friends, 
       hobby1: req.session.hobby1,
       hobby2: req.session.hobby2,
       hobby3: req.session.hobby3,
       group1:req.session.group1,
       group2:req.session.group2,
       group3:req.session.group3,
       hobbies:arrayOfHobbies,
       groups:arrayOfGroups
    });
});
    });
    
}

router.get('/browse_profile2/:id', ensureAuthenticated,function (req, res){
    
           console.log('broswe profile2');
          var id =req.params.id;
          browse_profile(req,res,id,"1");
            });    


router.get('/browse_profile/:id', ensureAuthenticated,function (req, res){

  var id =req.params.id;
  browse_profile(req,res,id,"0");
    });

router.post('/browse_profile', ensureAuthenticated,function (req, res){

//browsing from search function
//	console.log('Getting friends');
//
var id = req.body.q
console.log('id' + id);
browse_profile(req,res,id,"2");

});

function browse_profile(req,res,id,accrej){
    var already_friends="";
 
    console.log('accrej' + accrej);
    var a=[];

    Friends.findOne({"friend":id,"user": req.session.username,status:"rejected friendship"},function(err,rf1)
    {   
        console.log('rf1' + rf1);
        if(rf1)
      {
            already_friends ="Friend request declined";
       
    };
    Friends.findOne({"friend":req.session.username,"user":id,status:"rejected friendship"},function(err,rf2)
    {
        
        if(rf2)
        {
       
            already_friends ="friend request declined";
     
          }; 
    Friends.findOne({"friend":id,"user": req.session.username,status:"is requesting to be your friend!"},function(err,frs1)
    {   
        console.log('frs1' + frs1);
        if(frs1)
      {
            already_friends ="friend request sent";
       
    };
    Friends.findOne({"friend":req.session.username,"user":id,status:"is requesting to be your friend!"},function(err,frs2)
    {
        
        if(frs1)
        {
       
            already_friends ="friend request sent";
     
          }; 
    Friends.findOne({"friend":id,"user": req.session.username,status:"are now friends!"},function(err,b1)
    {   
        console.log('b1' + b1);
        if(b1)
      {
            already_friends ="One of your friends!";
       
    };
    Friends.findOne({"friend":req.session.username,"user":id,status:"are now friends!"},function(err,b2)
    {
        
        if(b2)
        {
       
            already_friends ="One of your friends!";
     
          };
     Friends.find({"friend":id,status:"are now friends!"},function(err,buddies1)
    {
            //find the person's friends
        buddies1.forEach(function(child){
            console.log("users1" + child.user);
            if(id != child.user)
            {        
            a.push(child.user);
            }
           });
     
      
        Friends.find({"user":id,status:"are now friends!"},function(err,buddies2)
        {

               //find the person's friends
            buddies2.forEach(function(child){
                console.log("users2" + child.friend);
               if(id != child.friend)
               {
                a.push(child.friend);
               }
               });
         
            console.log('already friends' + already_friends);
            c.find({"challenged":id,"status":"Challenge completed"},function(err,cp)
            {
        
            c.find({"challenged":id,"status":"Challenge made"},function(err,ch)
            {
             
               
               c.find({"challenged":id,"status":"Challenge accepted"},function(err,ca){
   
                User.findOne({"username":id},function(err, arrayOfUsers) {
			           console.log('user' + arrayOfUsers)
				res.render('browse_profile', {
                    Buddies:a,
                    us: arrayOfUsers,
                    user: req.user,
                    Challenge:req.session.challenges,
                    pic:req.session.pic,
                    friend_request:req.session.friends,
                    already_friends:already_friends,
                    challengesaccepted:ca,
                    challengescompleted:cp,
                    accrej:accrej
                });
			});
			});
		});
    });
});
    });
});
    });
});
    });
});
    });
};
   













function home_page(req,res){
    Hobby.find(function(err, hobbies) {
        User.findOne({username:req.user.username},function(err,u){
               req.session.location=u.location;
               req.session.user_id = u._id;
               req.session.hobby1=u.hobby1;
               req.session.hobby2=u.hobby2;
               req.session.hobby3=u.hobby3;
               req.session.group1=u.group1;
               req.session.group2=u.group2;
               req.session.group3=u.group3;

               var a =[];
               Friends.find({"friend":req.user.username,status:"are now friends!"},function(err,buddies1)
               {
                buddies1.forEach(function(child){
                    console.log("users1" + child.user);
                    if(req.user.username != child.user)
                    {        
                    a.push(child.user);
                    }
                   });

                   Friends.find({"user":req.user.username,status:"are now friends!"},function(err,buddies2)
                   {
                      
                       buddies2.forEach(function(child){
                           console.log("users2" + child.friend);
                          if(req.user.username != child.friend)
                          {
                           a.push(child.friend);
                          }
                          });
                    
                req.session.made_buddies=a;
                  console.log('ll' + a);
                   Friends.find({"friend":req.user.username,status:"is requesting to be your friend!"},function(err,fr)
                       {
                         req.session.friends=fr;
                         c.find({"challenged":req.user.username,"status":"Challenge completed"},function(err,cp)
                         {
                             console.log('Challenges Completed Total' +  cp);
                             req.session.challenge_completed=cp;
                         c.find({"challenged":req.user.username,"status":"Challenge made"},function(err,ch)
                         {
                            req.session.challenges = ch;
                            
                            c.find({"challenged":req.user.username,"status":"Challenge accepted"},function(err,ca){
                             console.log("challenges" +req.session.challenges);
                             
                            req.session.pic= req.user.pic;
                              req.session.username=req.user.username;
                            res.render('index',
                              {
                                    pic:req.user.pic,
                                    username: req.user.username,
                                    friend_request:req.session.friends,
                                    Challenge:req.session.challenges,
                                    Buddies:a,
                                    hobby1: req.session.hobby1,
                                    hobby2:req.session.hobby2,
                                    hobby3:req.session.hobby3,
                                    group1: req.session.group1,
                                    group2:req.session.group2,
                                    group3:req.session.group3,
                                    location:u.location,
                                    hobbies:hobbies,
                                    challengesaccepted:ca,
                                    challengescompleted:cp
                              });
                     
                           });
                      
                        });
                      
                      
                    });   
                      
                      
                        });
                    });     
    
            });
    });
});
 };





router.post('/update_location', (req, res) => {
     console.log('location' + req.body.location + 'abc' + req.body.group1 + 'sdf' + req.body.group2 + 'sfds' + req.body.group3 + 'sdf' + req.body.hobby1 + 'sdf' + req.body.hobby2 + 'sdf' + req.body.hobby3 )
    User.findOne({username: req.session.username},function(err,foundObject)
    {
            if(err)
            {
                console.log(err);
            }else
            {
                console.log(foundObject);
                foundObject.location=req.body.location;
                foundObject.group1=req.body.group1;
                foundObject.group2=req.body.group2;
                foundObject.group3=req.body.group3;
                foundObject.hobby1=req.body.hobby1;
                foundObject.hobby2=req.body.hobby2;
                foundObject.hobby3=req.body.hobby3;
                foundObject.save(function(err,updatedObject){
                    if(err){
                        console.log(err);
                        res.status(500).send();
                    }else
                    {
                     req.session.location=req.body.location;                      
           
              req.session.group1=req.body.group1;
               req.session.group2=req.body.group2;
                req.session.group3=req.body.group3;
                req.session.hobby1=req.body.hobby1;
                req.session.hobby2=req.body.hobby2;
               req.session.hobby3=req.body.hobby3;
                     
                     
                     
                     edit_profile(req,res);

                    }
                              });

            }
    });

});    




router.post('/save_challenge', (req, res) => {


    console.log('ddd' + req.session.user_id);
    var h = new Challenge({
                     challenge:   req.body.challenge_text,
                     id:    req.body.challenge_id,
                     user_id:     req.session.user_id
                 }).save(function(err) {
                       console.log('problem creating challenge' + err);
                 });     
          
    
    home_page(req,res);
});








router.get('/my_friends', (req, res) => {

    Friends.find({"friend":req.user.username,status:"are now friends!"},function(err,buddies1)
    {

      


        Friends.find({"user":req.user.username,status:"are now friends!"},function(err,buddies2)
        {
            var a =[];
            buddies2.forEach(function(child){
                console.log("users" + child.friend);
                if(child.friend != req.session.username)
                {
                a.push(child.friend);
                };
               });
            buddies1.forEach(function(child){
                console.log("users" + child.user);
                if(child.user != req.session.username)
                {
                a.push(child.user);
                };
               });
            User.find( { "username" :  { $in : a } }, function(err,u)
              {
                  console.log('jjjj' + u);
          res.render('my_friends', {
             
        myfriends:u,
      
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
        });
        });
  });
    });
});

router.get('/see_friend_request', (req, res) => {
  
  
    Friends.find({"friend":req.user.username,status:"is requesting to be your friend!"},function(err,fr)
    {
   
        res.render('see_friend_requests', {
          friend:fr,
          user: req.user,
          Challenge:req.session.challenges,
          pic:req.session.pic,
          friend_request:req.session.friends 
        });
    });
  });



router.get('/find_friends', (req, res) => {
    console.log('get');
     User.find().limit(6).then(usrs => {
       console.log('users' + usrs);
      res.render('find_friends', {
        pageTitle: 'Node Search',
        users: usrs,
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
      });
    }).catch(err => {
        res.sendStatus(404);
    });
  });
  
  router.post('/search', (req, res) => {
   
    let q = req.body.query;
    console.log('xyz' + q);
    let query = {
      "$or": [{"username": {"$regex": q, "$options": "i"}}, {"name": {"$regex": q, "$options": "i"}}]
    };
    let output = [];
  console.log(query);
    User.find(query).limit(6).then( usrs => {
      console.log('sdfsdf' + usrs);
        if(usrs && usrs.length && usrs.length > 0) {
          console.log('erwerwerwr');
            usrs.forEach(user => {
              console.log(user);
               let obj = {
                  id: user.username,
                  label: user.pic,
                
              };
              output.push(obj);
            });
        }
        res.json(output);
    }).catch(err => {
      res.sendStatus(404);
    });
  
  });







// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){

home_page(req,res);
});

router.get('/see_accepted_challenges', ensureAuthenticated, function(req, res){
    


 c.find({"status":"Challenge accepted","challenged":req.session.username},function(err, a) {
    
    var challenger=[];
    a.forEach(function(child){
         challenger.push(child.challenger);
    });


console.log('www' + challenger);
User.find( { username : challenger  },function(err, challengers) {
              


    var b =[];
    a.forEach(function(child){
        console.log("users" + child.id);
        b.push(child.id);
       });
console.log('9999' +b);
       Challenge.find( { "id" :  { $in : b } }, function(err,u)
       { 
          console.log('jjjk' + u);
     


  
 //   c.find({"challenged":req.session.username},{"status":"Challenge made"},function(err,c)
 ///   {
 //       console.log('qqq' + c);
       res.render('see_accepted_challenges',{
          challenges: a,
            username:req.user.username,
            user: req.user,
            Challenge:req.session.challenges,
            pic:req.session.pic,
            friend_request:req.session.friends,
            k:u,
            challenger:challengers
       });
 //       });      
        });
     });
    });
    });

    router.get('/see_completed_challenges', ensureAuthenticated, function(req, res){
        
    
    
     c.find({"status":"Challenge completed","challenged":req.session.username},function(err, a) {
        
        var challenger=[];
        a.forEach(function(child){
             challenger.push(child.challenger);
        });
    
    
    console.log('www' + challenger);
    User.find( { username : challenger  },function(err, challengers) {
                  
    
    
        var b =[];
        a.forEach(function(child){
            console.log("users" + child.id);
            b.push(child.id);
           });
    console.log('9999' +b);
           Challenge.find( { "id" :  { $in : b } }, function(err,u)
           { 
              console.log('jjjk' + u);
         
    
    
      
     //   c.find({"challenged":req.session.username},{"status":"Challenge made"},function(err,c)
     ///   {
     //       console.log('qqq' + c);
           res.render('see_completed_challenges',{
              challenges: a,
                username:req.user.username,
                user: req.user,
                Challenge:req.session.challenges,
                pic:req.session.pic,
                friend_request:req.session.friends,
                k:u,
                challenger:challengers
           });
     //       });      
            });
         });
        });
        });
    
    
    
    





router.get('/see_challenge_request', ensureAuthenticated, function(req, res){
    

       
        c.find({"status":"Challenge made","challenged":req.session.username},function(err, a) {
    
           var challenger=[];
            a.forEach(function(child){
                 challenger.push(child.challenger);
            });


        console.log('www' + challenger);
       User.find( { username : challenger  },function(err, challengers) {
              




              console.log('challenger' + challengers);
    var b =[];
    a.forEach(function(child){
        console.log("users" + child.id);
        b.push(child.id);
       });
console.log('9999' +b);
       Challenge.find( { "id" :  { $in : b } }, function(err,u)
       { 
          console.log('jjjk' + u);
     


        
 //   c.find({"challenged":req.session.username},{"status":"Challenge made"},function(err,c)
 ///   {
 //       console.log('qqq' + c);
       res.render('see_challenge_request',{
          challenges: a,
            username:req.user.username,
            user: req.user,
            Challenge:req.session.challenges,
            pic:req.session.pic,
            friend_request:req.session.friends,
            k:u,
            challenger:challengers
       });
        });      
        });
    });
    
    });

   router.get('/see_c/:id', ensureAuthenticated, function(req, res){
    
    
        console.log("see_friends_challenge" + + "sdf");
        res.render('challenge_someone',{
            username:req.user.username,
            title:req.body.title,
            user: req.user,
            Challenge:req.session.challenges,
            pic:req.session.pic,
            friend_request:req.session.friends,
            player:'none',
            rec:'none',
            id:req.params.id
        });
    });

 
    
router.get ('/view_challenge/:id', function (req, res){
   
   
   
    res.render('view_challenge',{
    user: req.user,
    Challenge:req.session.challenges,
    pic:req.session.pic,
    friend_request:req.session.friends,
    id:req.params.id 
     		});
        });



       
   
        router.get ('/view_video2/:id',ensureAuthenticated ,function (req, res){
            console.log('view video2' + req.session.friends);
            req.session.token=req.params.id;
            res.render('challenge_someone2',{
                       token:req.params.id,
                       title:req.params.title,
                       user: req.user,
                       Challenge:req.session.challenges,
                       pic:req.session.pic,
                       friend_request:req.session.friends,
                       buddies:req.session.made_buddies,
                       rec:'none',
                       challenged:'none'
                     });
                    });


        router.get ('/view_video/:id',ensureAuthenticated ,function (req, res){
            console.log('view video' + req.session.friends);
            req.session.token=req.params.id;
            res.render('challenge_someone',{
                       token:req.params.id,
                       title:req.params.title,
                       user: req.user,
                       Challenge:req.session.challenges,
                       pic:req.session.pic,
                       friend_request:req.session.friends,
                       buddies:req.session.made_buddies,
                       rec:'none',
                       challenged:'none'
                     });
                    });

                    router.get('/challenge_completed', ensureAuthenticated, function(req, res){
                
                    c.findOne({challenged: req.session.username,id:req.params.id},function(err,foundObject)
                    {
                        if(err)
                        {
                            console.log("error accepting accept challenge" + err);
                        }else
                        {
                            console.log("object found:" + foundObject);
                            foundObject.status="Challenge completed";
                                foundObject.save(function(err,updatedObject){
                                if(err){
                                    console.log(err);
                                    res.status(500).send();
                                }else
                                {
                                    home_page(req,res);
                                    }
                                          });
                
                        }
                });
                    });
              
                  
                    router.post('/reject_challenge', ensureAuthenticated, function(req, res){
                        
                  
                
                
                    c.findOne({challenged: req.session.username,id:req.body.reject_id},function(err,foundObject)
                    {
                        if(err)
                        {
                            console.log("error accepting accept challenge" + err);
                        }else
                        {
                            console.log("object found:" + foundObject);
                            foundObject.status="Challenge rejected";
                                foundObject.save(function(err,updatedObject){
                                if(err){
                                    console.log(err);
                                    res.status(500).send();
                                }else
                                {
                                    home_page(req,res);
                                    }
                                          });
                
                        }
                });
                    });
                
                
                    router.post('/complete_challenge', ensureAuthenticated, function(req, res){
                        
                  
                
                
                    c.findOne({challenged: req.session.username,id:req.body.complete_id},function(err,foundObject)
                    {
                        if(err)
                        {
                            console.log("Challenge Completed" + err);
                        }else
                        {
                            console.log("object found:" + foundObject);
                            foundObject.status="Challenge completed";
                                foundObject.save(function(err,updatedObject){
                                if(err){
                                    console.log(err);
                                    res.status(500).send();
                                }else
                                {
                                    home_page(req,res);
                                    }
                                          });
                
                        }
                });
                    });
                    
                
         
  router.post('/accept_challenge', ensureAuthenticated, function(req, res){
        
  


    c.findOne({challenged: req.session.username,id:req.body.challenge_id},function(err,foundObject)
    {
        if(err)
        {
            console.log("error accepting accept challenge" + err);
        }else
        {
            console.log("object found:" + foundObject);
            foundObject.status="Challenge accepted";
                foundObject.save(function(err,updatedObject){
                if(err){
                    console.log(err);
                    res.status(500).send();
                }else
                {
                    home_page(req,res);
                    }
                          });

        }
});
    });








router.get('/challenge_someone', ensureAuthenticated, function(req, res){


    console.log("challenge someone" + req.body.title + "sdf");
	res.render('challenge_someone',{
        username:req.user.username,
        title:req.body.title,
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends,
        player:'none',
        challenged:'none'
	});
});


router.post('/challenge_folks', ensureAuthenticated, function(req, res){
    
  //  console.log('ddd' + req.session.user_id);
  var fr= req.body.fr2;
  console.log('qqqqs' + fr);
  var f="";
    var array = fr.split(';');

    for(let i=0;i<array.length;i++)
    {
        var a = array[i];
        
       if (a.length>0)
       {
        var challenge = new c({
           challenger: req.session.username,  
           challenged:a,             
            id: req.body.challenge_id,
            status:"Challenge made"
        }).save(function(err) {
          if(err)
           {
            console.log('problem here friend request' + err);
            }else
           {
            console.log('Saved ok');
              }
        });
    }
    }
    home_page(req,res);
 });    

router.get('/edit_profile', ensureAuthenticated, function(req, res){
    edit_profile(req,res);
 });      
   
router.get ('/videos',ensureAuthenticated, function (req, res){
    
         
	 Challenge.find({"user_id":req.session.user_id},function(err, challenges) {
       
        
        
        
          c.find({"challenger":  req.session.username},function(err, who_is_already_challenged) {
            console.log('pppppp' + who_is_already_challenged);
     

    	res.render('videos', {
                page_title: 'Challenge You All Videos',
                need_ziggeo: 1,
                videos: challenges,
                user: req.user,
                Challenge:req.session.challenges,
                pic:req.session.pic,
                fr:req.session.made_buddies,
                user: req.user,
                ch:challenges,
                wh:who_is_already_challenged,
                friend_request:req.session.friends,
                
           
        });             
            });
});
});
router.get ('/video/:videoId', function (req, res){
    var video_id = req.params.videoId
    res.render ('video',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: 'Single video',
        video_id: video_id,
        need_ziggeo: 1,
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
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
        need_ziggeo: 1,
         user: req.user,
    Challenge:req.session.challenges,
    pic:req.session.pic,
    friend_request:req.session.friends 
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
                videos: index,
                user: req.user,
                Challenge:req.session.challenges,
                pic:req.session.pic,
                friend_request:req.session.friends 
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
          user: req.user,
          user: req.user,
          Challenge:req.session.challenges,
          pic:req.session.pic,
          friend_request:req.session.friends 
      })

})

router.get ('/upload', function (req, res){
    res.render ('upload',{
        ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
        page_title: 'Upload video',
        need_ziggeo: 1,
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
    })
})

router.get ('/approve', function (req, res){
    ZiggeoSdk.Videos.index ({limit:100}, {
        success: function (index) {
            res.render('approve', {
                ziggeo_api_token: 'r1e4a85dd1e7c33391c1514d6803b975',
                page_title: 'Approve Videos',
                need_ziggeo: 1,
                videos: index,
                user: req.user,
                Challenge:req.session.challenges,
                pic:req.session.pic,
                friend_request:req.session.friends 
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
        need_ziggeo: 0,
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
    })
})
router.get ('/admin', function (req, res){
     
    res.render ('admin', {
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
    })
});



router.get ('/request_make_friends/:id', function (req, res){
	var id = req.params.id;
	
	
if(req.user.username != id)
   {
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
            home_page(req,res);
           }
		});

    }
    else
    {
     home_page(req,res);
    }
    });

router.get ('/send_friends', function (req, res){
	
		console.log('Find friends');
		
				User.find(function(err, arrayOfUsers) {
				   console.log('users' + arrayOfUsers)
				
					res.render('find_friends', {
                        friends: arrayOfUsers,
                        user: req.user,
                        Challenge:req.session.challenges,
                        pic:req.session.pic,
                        friend_request:req.session.friends 
					});
				});
			});








            router.get ('/challenge_this_friend/:friend', function (req, res)
                
          {
               
         
             
            var challenge = new c({
                challenger: req.session.username,               
                challenged: req.params.friend,
                id: req.session.token,
                status:"Challenge made"
            }).save(function(err) {
               if(err)
               {
                console.log('problem here friend request' + err);
               home_page(req,res);
               }else
               {
                console.log('Saved ok');
                home_page(req,res);                     
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
        friend_request:fr,
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
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
                                       user: req.params.user,
                                       user: req.user,
                                       Challenge:req.session.challenges,
                                       pic:req.session.pic,
                                       friend_request:req.session.friends 
                                 });
                        
                        });



            router.get ('/make_friends/:id', function (req, res){
            
                    console.log('make friends' + req.params.id) ;
               Friends.findOne({user: req.params.id},function(err,foundObject)
                {
                        if(err)
                        {
                        }else
                        {

                            console.log(foundObject);
                            foundObject.status="are now friends!"
                            foundObject.save(function(err,updatedObject){
                                if(err){
                                    console.log("1111" +err);
                                    res.status(500).send();
                            }else
                                
                            {
                                    home_page(req,res);

                                }
                                          });

                        }
                });         
                        });



                        router.get ('/reject_friends/:id', function (req, res){
                            
                                    console.log('rejected friends' + req.params.id) ;
                               Friends.findOne({user: req.params.id},function(err,foundObject)
                                {
                                        if(err)
                                        {
                                        }else
                                        {
                
                                            console.log(foundObject);
                                            foundObject.status="rejected friendship"
                                            foundObject.save(function(err,updatedObject){
                                                if(err){
                                                    console.log("1111" +err);
                                                    res.status(500).send();
                                            }else
                                                
                                            {
                                                    home_page(req,res);
                
                                                }
                                                          });
                
                                        }
                                });         
                                        });
                

router.post('/search', (req, res) => {
     consoloe.log("sdfsdfs" + req);
    let q = req.body.query;
    let query = {
      "$or": [{"username": {"$regex": q, "$options": "i"}}, {"name.": {"$regex": q, "$options": "i"}}]
    };
    let output = [];
  
    Users.find(query).limit(6).then( usrs => {
        if(usrs && usrs.length && usrs.length > 0) {
            usrs.forEach(user => {
              let obj = {
                  id: username + ' ' + name,
                  label: username + ' ' + name
              };
              output.push(obj);
            });
        }
        res.render('find_friends', {
            output: output
        });
    }).catch(err => {
      res.sendStatus(404);
    });
  
  });
  




  router.get('/search_member', function(req, res) {
      console.log('search member');
    var regex = new RegExp(req.query["term"], 'i');
    var query = User.find({fullname: regex}, { 'fullname': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
         
       // Execute query in a callback and return users list
   query.exec(function(err, users) {
       if (!err) {
          // Method to construct the json result set
          var result = buildResultSet(users); 
          res.send(result, {
             'Content-Type': 'application/json'
          }, 200);
       } else {
          res.send(JSON.stringify(err), {
             'Content-Type': 'application/json'
          }, 404);
       }
    });
});



function find_friends(res){


    User.find(function(err, arrayOfUsers) {

        console.log('users' + arrayOfUsers)
     
         res.render('find_friends', {
             friends: arrayOfUsers,
             user: req.user,
             Challenge:req.session.challenges,
             pic:req.session.pic,
             friend_request:req.session.friends 
         });
     });

    
};



router.get('/find_friends', (req, res) => {
  
     User.find().limit(6).then(usrs => {
         res.render('find_friends', {
        pageTitle: 'Node Search',
        users: usrs,
        user: req.user,
        Challenge:req.session.challenges,
        pic:req.session.pic,
        friend_request:req.session.friends 
      });
    }).catch(err => {
        res.sendStatus(404);
    });
  
  });
  
  router.post('/search', (req, res) => {
   
    let q = req.body.query;
    console.log('xyz' + q);
    let query = {
      "$or": [{"username": {"$regex": q, "$options": "i"}}, {"name": {"$regex": q, "$options": "i"}}]
    };
    let output = [];
  console.log(query);
    Users.find(query).limit(6).then( usrs => {
      console.log('sdfsdf' + usrs);
        if(usrs && usrs.length && usrs.length > 0) {
          console.log('erwerwerwr');
            usrs.forEach(user => {
              console.log(user);
              let obj = {
                  id: user.username + ' ' + user.name,
                  label: user.username + ' ' + user.name
              };
              output.push(obj);
            });
        }
        res.json(output);
    }).catch(err => {
      res.sendStatus(404);
    });
  
  });
  
	

	

router.get('/groups', function(req, res) {
	
console.log('Getting groups');

		Group.find(function(err, arrayOfGroups) {
			res.render('groups', {
                groups: arrayOfGroups,
                user: req.user,
                Challenge:req.session.challenges,
                pic:req.session.pic,
                friend_request:req.session.friends 
			});
		});
	});

router.get('/hobbies', function(req, res) {
console.log('Getting hobbies');

		Hobby.find(function(err, arrayOfHobbies) {
			res.render('hobbies', {
                hobbies: arrayOfHobbies,
            
			});
		});
	});

    router.get('/my_hobbies', function(req, res) {    
    console.log('Get my hobbies' + req.user);
    Hobby.find(function(err, toHobby) {    
        console.log(toHobby + req.session.username)
            AddHobby.find({user:req.session.username},function(err, arrayOfHobbies) {
                  res.render('my_hobbies', {   
                           h: toHobby,       
                             hobbies: arrayOfHobbies,
                            user: req.user,
                            Challenge:req.session.challenges,
                            pic:req.session.pic,
                            friend_request:req.session.friends 
                        });
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
		
		
		
		
		
		
		


        router.post('/hobbies', function(req, res) {
            
                var hobby = new Hobby({
                    hobby: req.body.hobby
                }).save(function(err) {
                      console.log('problem saving group');
                    //______________________________|BEGIN
                Hobby.find(function(err, toHobby) {
            
                        hobbies: toHobby
            
                    });
                    //______________________________|END
            
                    res.redirect('/hobbies');
            
                });
            
            });
    

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



  var cloudinary = require('cloudinary'); 

  cloudinary.config({ 
    cloud_name: 'dz1wt4zut', 
    api_key: '114533942435592', 
    api_secret: '6HVvZgHk1AfKUq2g2nVwTkBDm9c' 
  });
  

  var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  var imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  var upload = multer({ storage: storage, fileFilter: imageFilter})
  
router.post('/upload_user_profile',ensureAuthenticated,upload.single('image'), (req, res) => {
  console.log('zzzz' + req);
   cloudinary.uploader.upload(req.file.path, function(result) {
    if (result.error) {
       console.log('error uploading file');
       res.render('index', {    
             user: req.user,
             Challenge:req.session.challenges,
             pic:req.session.pic,
             friend_request:req.session.friends 
               });
       
        // see result.error.message and result.error.http_code
      } else {

        User.findOne({_id: req.user._id},function(err,foundObject)
            {
                    if(err)
                    {
                        console.log(err);
                    }else
                   {
                       console.log(foundObject);
                        foundObject.pic=result.secure_url
                        foundObject.save(function(err,updatedObject){
                            if(err){
                                console.log(err);
                                res.status(500).send();
                            }else
                            {
                                req.session.pic=result.secure_url;
                            edit_profile(req,res);
                        }
                                     });
                   }
            });
      }
  
  
  
    console.log("tttt" + result);
    // add cloudinary url for the image to the campground object under image property
        console.log("eee"+ result.secure_url);
        // add author to campground
  //  console.log("sdfsdf" + result.secure.url);
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