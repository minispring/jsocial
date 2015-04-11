var Header = require('../common/header.jsx');
var Sidebar = require('../common/sidebar.jsx');
var Footer = require('../common/footer.jsx');
var Recommend = require('../common/recommend_people.jsx');
var moment = require('moment');
moment.locale('zh-cn');
var AppDispatcher = require('../dispatcher/dispatcher.jsx');
var ActionTypes = require('../constants/constants.jsx');
var PostStore = require('../stores/posts_store.jsx');
var UsersStore = require('../stores/users_store.jsx');
var classSet = React.addons.classSet;

var NewPost = React.createClass({
  getInitialState: function () {
    return {
      isLoggedIn: UsersStore.isLoggedIn()
    };
  },
  componentDidMount: function() {
    UsersStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    UsersStore.removeChangeListener(this._onChange);
  },
  _handleClick: function(){
    var content = this.refs.postContent.getDOMNode().value;
    AppDispatcher.dispatch({
      type: ActionTypes.POSTS_CREATE,
      content:content
    });
    this.refs.postContent.getDOMNode().value = '';
  },
  _onChange: function(){
    this.setState({isLoggedIn: UsersStore.isLoggedIn()});
  },
  render: function () {
    if(!this.state.isLoggedIn)
      return <noscript></noscript>;
    var holder = l20n.ctx.getSync('inputNewPost',null);
    return (
      <PanelContainer noControls >
        <PanelBody style={{padding: 12.5}}>
          <Textarea rows='3' placeholder={holder} style={{border: 'none'}} ref="postContent"/>
        </PanelBody>
        <PanelFooter className='fg-black75 bg-gray' style={{padding: '12.5px 25px'}}>
          <Grid>
            <Row>
              <Col xs={6} collapseLeft collapseRight>
                <a href='#' style={{border: 'none'}}><Icon glyph='icon-dripicons-location icon-1-and-quarter-x fg-text' style={{marginRight: 25}} /></a>
                <a href='#' style={{border: 'none'}}><Icon glyph='icon-dripicons-camera icon-1-and-quarter-x fg-text' style={{marginRight: 25}} /></a>
                <a href='#' style={{border: 'none'}}><Icon glyph='icon-dripicons-calendar icon-1-and-quarter-x fg-text' style={{marginRight: 25}} /></a>
              </Col>
              <Col xs={6} className='text-right' collapseLeft collapseRight>
                <Button onClick={this._handleClick} bsStyle='darkgreen45'><Entity entity='share'/></Button>
              </Col>
            </Row>
          </Grid>
        </PanelFooter>
      </PanelContainer>
    )
  }
});
var NewComment = React.createClass({
  getInitialState: function () {
    return {
      expanded: false,
      disabledOkBtn: true,
      disabledCancelBtn: false,
      author: UsersStore.getUser(),
      isLoggedIn: UsersStore.isLoggedIn()
    };
  },
  componentDidMount: function() {
    UsersStore.addChangeListener(this._onLogin);
    PostStore.addPostChangeListener(this._onCreateComplete);
  },
  componentWillUnmount: function() {
    UsersStore.removeChangeListener(this._onLogin);
    PostStore.removePostChangeListener(this._onCreateComplete);
  },
  _onLogin: function(){
    this.setState({
      author: UsersStore.getUser(),
      isLoggedIn: UsersStore.isLoggedIn()
    });
  },
  _onCreateComplete: function(post){
    if(post._id == this.props.source._id) {
      this._handleCancel();
    }
  },
  _handleExpand: function(){
    this.setState({ expanded: true });
  },
  _handleOk: function(){
    var content = this.refs.commentContent.getDOMNode().innerText;
    AppDispatcher.dispatch({
      type: ActionTypes.COMMENTS_CREATE,
      data: {content:content,source:this.props.source}
    });
    this.setState({
      disabledOkBtn: true,
      disabledCancelBtn: true
    });
  },
  _handleChange: function(){
    if(this.refs.commentContent.getDOMNode().innerText.length > 0){
      this.setState({ disabledOkBtn: false });
    }else{
      this.setState({ disabledOkBtn: true });
    }
  },
  _handleCancel: function(){
    this.refs.commentContent.getDOMNode().innerHTML = '';
    if(this.props.hideCommentHolder) {
      this.props.parent._handleNewComment();
    }else{
      this.setState({
        expanded: false,
        disabledOkBtn: true,
        disabledCancelBtn: false
      });
    }
  },
  render: function () {
    if(!this.state.isLoggedIn)
      return <noscript></noscript>;
    var holder = l20n.ctx.getSync('inputNewComment',null);
    var footerClass = classSet({
      'hide': !(this.state.expanded || this.props.expanded) && this.props.hideCommentHolder,
      'bg-gray': true
    });
    var inputClass = classSet({
      'hide': this.state.expanded || this.props.hideCommentHolder
    });
    var divClass = classSet({
      'hide': !(this.state.expanded || this.props.expanded)
    });
    var footerPadding = '15px 25px 15px 25px';
    if(this.state.expanded) {
      footerPadding = '15px 0 15px 0';
    }
    var okBtn = <Button ref='okBtn' bsStyle='success' onClick={this._handleOk}><Entity entity='submitComment'/></Button>;
    if(this.state.disabledOkBtn) {
      okBtn = <Button ref='okBtn' disabled bsStyle='success' onClick={this._handleOk}><Entity entity='submitComment'/></Button>;
    }
    var cancelBtn = <Button ref='cancelBtn' style={{marginLeft:'4px'}} bsStyle='darkgray50' onClick={this._handleCancel}><Entity entity='cancel'/></Button>;
    if(this.state.disabledCancelBtn) {
      cancelBtn = <Button ref='cancelBtn' disabled style={{marginLeft:'4px'}} bsStyle='darkgray50' onClick={this._handleCancel}><Entity entity='cancel'/></Button>;
    }
    return (
      <PanelFooter style={{marginTop:0, padding: footerPadding, borderTop: 0}} className={footerClass}>
        <Input className={inputClass} type='text' placeholder={holder}  onClick={this._handleExpand}
               style={{border: '1px solid #d8d8d8'}}/>
        <Grid className={divClass}>
          <Row>
            <Col xs={2}>
              <img src={this.state.author.avatar} width='30' height='30'
                   style={{verticalAlign:'top',top:10,position:'relative'}}/>
            </Col>
            <Col xs={9} className="comment-editor-main bg-white">
              <div ref="commentContent" onKeyUp={this._handleChange} contentEditable placeholder={holder} className="comment-editor"></div>
            </Col>
          </Row>
          <div className='text-right' style={{paddingRight:'10px'}} >
            {okBtn}
            {cancelBtn}
          </div>
        </Grid>
      </PanelFooter>
    )
  }
});

var PostComment = React.createClass({
  getDefaultProps: function() {
    return {
      author:{
        name: "admin",
        avatar: "/imgs/avatars/avatar4.png"
      }
    };
  },
  render: function () {
    return (
      <div className='inbox-avatar' style={{borderBottom: '1px solid #EAEDF1'}}>
        <img src={this.props.author.avatar} width='30' height='30' style={{verticalAlign:'top',top:10,position:'relative'}} />
        <div className='inbox-avatar-name'>
          <div className='fg-darkgrayishblue75'>{this.props.author.name}</div>
          <div className='fg-text'><small>{this.props.children}..</small></div>
        </div>
        <div className='inbox-date hidden-sm hidden-xs fg-text text-right'>
          <div><small><strong>{this.props.date}</strong></small></div>
        </div>
      </div>
    )
  }
});

var MoreComments = React.createClass({
  getDefaultProps: function() {
    return {
      counts:0
    };
  },
  getInitialState: function () {
    return {
      collapsed: true
    };
  },
  render: function(){
    return (
      <span></span>
    );
  }
});

var PostSummary = React.createClass({
  getInitialState: function () {
    return {
      likeActive: false,
      reshareActive: false,
      reshareTextStyle: 'fg-white',
      post: this.props.post,
      newCommentExpanded: false,
      isLoggedIn: UsersStore.isLoggedIn()
    };
  },
  componentDidMount: function() {
    PostStore.addPostChangeListener(this._onChange);
    UsersStore.addChangeListener(this._onLogin);
  },
  componentWillUnmount: function() {
    PostStore.removePostChangeListener(this._onChange);
    UsersStore.removeChangeListener(this._onLogin);
  },
  _onLogin: function(){
    this.setState({isLoggedIn: UsersStore.isLoggedIn()});
  },
  _onChange: function(post) {
    if(post._id == this.state.post._id) {
      this.setState({post: post});
    }
  },
  _handleReshare: function() {
    var post = this.state.post;
    var reshareActive = this.state.reshareActive;
    if(reshareActive) {
      post.reshare_count--;
      reshareActive = false;
    }else{
      post.reshare_count++;
      reshareActive = true;
    }
    this.setState({
      post: post,
      reshareActive: reshareActive
    });
  },
  _handleLike: function() {
    var post = this.state.post;
    var likeActive = this.state.likeActive;
    if(likeActive) {
      post.like_count--;
      likeActive = false;
    }else{
      post.like_count++;
      likeActive = true;
    }
    this.setState({
      post: post,
      likeActive: likeActive
    });
  },
  _handleNewComment: function(){
    this.setState({
      newCommentExpanded:!(this.state.newCommentExpanded)
    });
  },
  render: function() {
    var create_at = moment(this.state.post.create_at, "YYYY-MM-DD HH:mm:ss").fromNow();
    var comments = {};
    this.state.post.comments.forEach(function(c) {
      var d = moment(c.create_at, "YYYY-MM-DD HH:mm:ss").fromNow();
      comments['comment-' + c._id] = <PostComment author={c.author} date={d} >{c.content}</PostComment>;
    });
    var img = <noscript></noscript>;
    if(this.props.img)
      img = <Img responsive src={this.props.img}/>;

    var holder = l20n.ctx.getSync('inputNewComment',null);
    var hideCommentHolder = false;
    if(this.state.post.comments.length > 0)
      hideCommentHolder = true;
    var inputClass = classSet({
      'hide': hideCommentHolder || this.state.newCommentExpanded || !this.state.isLoggedIn
    });
    return (
      <PanelContainer noControls className="item">
        <PanelBody style={{padding: 25, paddingTop: 12.5}}>
          <div className='inbox-avatar'>
            <img src={this.state.post.author.avatar} width='40' height='40' style={{borderRadius: '20px'}}/>
            <div className='inbox-avatar-name'>
              <div className='fg-darkgrayishblue75'>{this.state.post.author.name}</div>
              <div className='fg-text'><small>{create_at}</small></div>
            </div>
            <div className='inbox-date hidden-sm hidden-xs fg-text text-right'>
              <div style={{position: 'relative', top: 0}}>
                <Icon className='fg-gray hide' glyph='icon-ikons-arrow-down icon-1-and-quarter-x'/>
              </div>
            </div>
          </div>
          <div>
            <div className='fg-text'>
              {this.state.post.content}
            </div>
          </div>
          <div style={{margin: -25, marginTop: 25}}>
            {img}
          </div>
        </PanelBody>
        <PanelFooter noRadius className='fg-black75 bg-white' style={{padding: '10px 10px', margin: 0}}>
          <Grid style={{marginRight:'-30px'}}>
            <Row>
              <Col xs={2} style={{marginLeft:'-20px'}}>
                <Button xs ref='likeCount' outlined bsStyle='orange65' active={this.state.likeActive} onClick={this._handleLike}>
                  <Icon glyph='icon-fontello-heart-1' />
                  <span style={{marginLeft:'5px'}}>{this.state.post.like_count}</span>
                </Button>
              </Col>
              <Col xs={2} >
                <Button xs style={{marginLeft:'5px'}} ref='reshareCount' outlined bsStyle='default' active={this.state.reshareActive} onClick={this._handleReshare}>
                  <Icon glyph='icon-stroke-gap-icons-Share' />
                  <span style={{marginLeft:'5px'}}>{this.state.post.reshare_count}</span>
                </Button>
              </Col>
              <Col xs={6} style={{margin:'0 0 0 10px'}}>
                <Input className={inputClass} type='text' placeholder={holder} onClick={this._handleNewComment}
                       style={{border: '1px solid #d8d8d8'}}/>
              </Col>
              <Col xs={2} >
                <img src='/imgs/avatars/avatar1.png' width='25' height='25' />
              </Col>
            </Row>
          </Grid>
        </PanelFooter>
        <PanelFooter style={{padding: 25, paddingTop: 0, paddingBottom: 0}} className="bg-gray">
          {comments}
        </PanelFooter>
        <NewComment source={{_id: this.state.post._id, type: 'post'}} expanded={this.state.newCommentExpanded} hideCommentHolder={!hideCommentHolder} parent={this}></NewComment>
      </PanelContainer>
    );
  }
});

var Body = React.createClass({
  getInitialState: function() {
    return {data: PostStore.getPosts()};
  },
  componentDidMount: function() {
    $('html').addClass('social');
    PostStore.addChangeListener(this._onChange);
    AppDispatcher.dispatch({ type: ActionTypes.POSTS_INIT });
  },
  componentWillUnmount: function() {
    $('html').removeClass('social');
    PostStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState({data: PostStore.getPosts()});
  },
  render: function() {
    var leftStream = {};
    var centerStream = {};
    var rightStream = {};
    for(var i=0;i<this.state.data.length;i++){
      var obj = this.state.data[i];
      if((i+1) % 3 == 0){
        rightStream["post-" + obj._id] = <PostSummary post={obj} />;
      }else if((i+1) % 2 == 0) {
        centerStream["post-" + obj._id] = <PostSummary post={obj} />;
      }else{
        leftStream["post-" + obj._id] = <PostSummary post={obj} />;
      }
    }
    return (
      <Container id='body' className='social'>
        <Grid>
          <Row><Col sm={4} collapseRight ></Col></Row>
          <Row>
            <Col sm={4} collapseRight ref="leftStream">
              <NewPost></NewPost>
              {leftStream}
            </Col>
            <Col sm={4} collapseRight ref="centerStream">
              {centerStream}
            </Col>
            <Col sm={4} collapseRight ref="rightStream">
              <Recommend className="hidden-sm hidden-xs"></Recommend>
              {rightStream}
            </Col>
          </Row>
        </Grid>
        {this.props.children}
      </Container>
    );
  }
});


var Posts = React.createClass({
  mixins: [SidebarMixin],
  componentWillMount: function(){

  },
  componentDidMount: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.USERS_INIT
    });
  },
  render: function() {
    var classes = classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Sidebar />
        <Header pressed />
        <Body/>
        <Footer />
      </Container>
    );
  }
});

module.exports = Posts;
