var passport = require('passport');
var MongoApi = require("../utils/mongoapi");
var MongoController = MongoApi.Controller;
var ModelDefault = MongoApi.ModelDefault;
var assign = require('object-assign');

module.exports = new MongoController({
  table: "users",
  model: {
    Default: {
      _id: ModelDefault.id,
      create_at: ModelDefault.now,
      avatar: "/imgs/avatars/avatar1.png",
      followed: function(req,model){
        return [assign({},model)];
      },
      circles:[],
      fans: function(req,model){
        return [assign({},model)];
      }
    },
    OutFormat: {
      hide: ["password"]
    },
    SimpleFormat: ["_id","name","avatar"]
  },
  url: {
    login: function (req, res, next) {
      passport.authenticate('local', function (err, user, info) {
        if (!user) {
          res.send({err:null,user:null});
          return;
        }
        req.login(user, function (err) {
          this.DB.findOne({_id: MongoApi.ObjectId(user._id)},function(err1,object,next1){
            res.send({err:null,user:object});
            next1();
          });
        }.bind(this));
      }.bind(this))(req, res, next);
    },
    getUser: function (req, res, next) {
      if (req.user){
        this.DB.findOne({_id: MongoApi.ObjectId(req.user._id)},function(err,object,next){
          res.send({err:null,user:object});
          next();
        });
      } else {
        res.send({err:null,user:null});
      }
    },
    getPosts:function(req,res){
      if (req.user){
        this.DB.findOne({_id: MongoApi.ObjectId(req.user._id)},function(err,object,next){
          var list = [];
          object.followed.forEach(function(follow){
            list.push(follow._id);
          });
          res.send({err:null,user:object});
          next();
        });
      } else {
        res.send({err:null,user:null});
      }
    },
    findRecommend: function(req, res){
      if(req.user) {
        this.DB.findSimples({count: 3, query: {_id: {$ne: MongoApi.ObjectId(req.user._id)}}}, function (err, object, next) {
          res.send(object);
          next();
        });
      } else {
        res.send([]);
      }
    },
    follow: function(req, res){
      if(req.user) {
        this.DB.update({query:{_id: MongoApi.ObjectId(req.user._id)},model:{ $push: {followed: MongoApi.ConvertObjectId(req.body)}}},function(err,next){
          res.send(true);
          next();
        });
      } else {
        res.send(false);
      }
    },
    unfollow: function(req, res){
      if(req.user) {
        this.DB.update({query:{_id: MongoApi.ObjectId(req.user._id)},model:{ $pull: {followed: {_id: MongoApi.ObjectId(req.body._id)}}}},function(err,next){
          res.send(true);
          next();
        });
      } else {
        res.send(false);
      }
    }
  }
})

