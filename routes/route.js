var mongoose = require( 'mongoose' );
var Comment = mongoose.model( 'Comment' );

exports.index=function(req,res){
                  res.render('index',{session:req.session});
              }


exports.techStack=function(req,res){
                                res.render('techStack',{session:req.session});
  }

exports.home=function(req,res){
             Comment.find({}, function(err,comments){
                  res.render('home',{comments:comments});
              });
}

exports.register=function(req,res){
  res.render('register');
                  }



exports.login=function(req,res){
                    res.render('login');
                                    }

exports.newComment=function(req,res){
          if(req.session.loggedIn !== true){
            console.log("Logged In :"+req.session.loggedIn);
            res.redirect('/login');
          }else{
              res.render('new-comment',{session:req.session});
          }

    }
