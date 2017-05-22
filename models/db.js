var chalk = require('chalk');
var mongoose = require( 'mongoose' );
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10;


//var dbURI = 'mongodb://localhost:27017/leavethemarks';


//var dbURI = 'mongodb://your_username:your_password@ds043615.mongolab.com:43615/leavethemarks';
//var dbURI = 'mongodb://<admin@123>:<admin@321>@ds021663.mlab.com:21663/senthilleavethemarks';
var dbURI = 'mongodb://selva:selva@ds117271.mlab.com:17271/selva'
mongoose.connect(dbURI, {server:{auto_reconnect:true}});


mongoose.connection.on('connected', function () {
  console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error',function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
  console.log(chalk.red('Mongoose disconnected'));
});



var userSchema = new mongoose.Schema({
  fname: {type: String},
  lname: {type: String},
  username: {type: String, unique:true},
  email: {type: String, unique:true},
  password: String
});


userSchema.pre('save', function(next) {
    var user = this;
    console.log("Before Registering the user");
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        console.log("Salt");
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            console.log("Hash : "+hash);
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



// Build the User model
mongoose.model( 'User', userSchema );

// Comments Schema

var commentsSchema = new mongoose.Schema({
  author:String,
  name:{type: String},
  email:{type: String,unique:true},
  title:{type: String,unique:true},
  created_at:{type:Date,default:Date.now},
  summary:String,
  content: {type: String},
  comments:[{body:String,commented_by:String,date:Date}],
  slug:String
});

// Build the User model

mongoose.model( 'Comment', commentsSchema,'comments');
