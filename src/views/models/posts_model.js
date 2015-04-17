var Posts_Model=function(){
  this._posts = [];
};

Posts_Model.prototype = {
  set: function (posts) {
    this._posts = posts ? posts : [];
  },
  get: function () {
    return this._posts;
  },
  clearMoreComments: function (id) {
    for(var i=0; i < this.posts.length; i++){
      if(this._posts[i]._id == id){
        delete this._posts[i].morecomments;
        return;
      }
    }
  },
  push: function(post){
    this._posts.push(post);
  },
  updatePost: function (post, comment) {
    for (var i = 0; i < this._posts.length; i++) {
      if (this._posts[i]._id == post._id) {
        if (post.morecomments){
          this._posts[i].morecomments = post.morecomments;
          if (comment)
            this._posts[i].morecomments.push(comment);
        }
        return;
      }
    }
  },
  removePost: function (id) {
    for (var i = 0; i < this._posts.length; i++) {
      if (this._posts[i]._id == id) {
        this._posts.splice(i, 1);
        return;
      }
    }
  },
  removeComment: function (post, comment) {
    for (var i = 0; i < this._posts.length; i++) {
      if (this._posts[i]._id == post._id) {
        if (this._posts[i].morecomments) {
          post.morecomments = this._posts[i].morecomments;
          for (var j = 0; j < post.morecomments.length; j++) {
            if (comment._id == post.morecomments[j]._id) {
              post.morecomments.splice(j, 1);
              break;
            }
          }
        }
        this._posts[i] = post;
        return;
      }
    }
  },
  updatePostComments: function (id, comments) {
    for (var i = 0; i < this._posts[i].length; i++) {
      if (this._posts[i]._id == id) {
        if (this._posts[i].morecomments)
          this._posts[i].morecomments.push(comments);
        else
          this._posts[i].morecomments = comments;
        return;
      }
    }
  }
};
module.exports = Posts_Model;