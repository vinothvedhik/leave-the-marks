var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');


exports.comments=function(req,res){
             Comment.find({}, function(err,comments){
                  res.render('home',{comments:comments,session:req.session});
              });
}

exports.addComment=function(req,res){
   var name=req.body.name;
   var email=req.body.email;
   var title=req.body.title;
   var content=req.body.content;
   var summary=req.body.summary;
   var author =req.session.username;
   console.log("Author is :"+author);

   var newComment=new Comment();
   newComment.author=author;
   newComment.name=name;
   newComment.email=email;
   newComment.title=title;
   newComment.content=content;
   newComment.summary=summary;

   var lowercaseTitle=newComment.title.toLowerCase();
   var slug=lowercaseTitle.replace(/[^a-zA-Z0-9 ]/g, "");
   var addingHyphen=slug.replace(/\s+/g, '-');

   newComment.slug=addingHyphen;

   newComment.save(function(err,savedComment){
       if(err){
         console.log("Error : While saving the comments");
         return res.status(500).send();
       }else{
         res.redirect("/comments");
       }
   });
}


exports.getComment=function(req,res){
   var url=req.params.comment;
   Comment.findOne({slug:url}, function(err,comment){
           res.render('comment',{comment:comment,session:req.session});
        });
}


exports.saveComment=function(req,res){
   var comment_slug=req.params.slug;
   var user_comment=req.body.user_comment;
   var posted_date=new Date();

   Comment.findOne({slug:comment_slug}, function(err,comment){

               comment.comments.push({body:user_comment,commented_by:req.session.username,date:posted_date});

               comment.save(function(err,savedComment){
                   if(err){
                     console.log("Error : While saving comments");
                     return res.status(500).send();
                   }else{
                     res.render('comment',{comment:comment,session:req.session});
                   }
               });

        });
 }
