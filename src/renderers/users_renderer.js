var MongoApi = require('../utils/mongoapi');
var UsersController = require("../controllers/users_controller");
var UserModel= require("../models/user_model");
var PageStore = require("./page_renderer");

module.exports = function(Handler,req,sender) {
  UsersController.DB.findOne({_id: MongoApi.ObjectId(req.user._id)}, function (err, obj, next) {
    var user = new UserModel();
    user.set(obj);
    next();
    PageStore(sender,req,Handler,{UsersStore:obj},{user:user});
  });
}