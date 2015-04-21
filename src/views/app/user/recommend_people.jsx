/**
 * Created by steven on 15/4/9.
 */
var Follow = require('./follow.jsx');
var AppDispatcher = require('../../dispatcher/dispatcher.jsx');
var ActionTypes = require('../../constants/constants.jsx');
var RecommendStore = require('../../stores/recommend_store.jsx');
var AuthMixin = require('../../mixins/auth_mixin.jsx');
var DataMixin = require('../../mixins/data_mixin.jsx');

var Recommend = React.createClass({
  mixins:[AuthMixin,DataMixin],
  getInitialState: function() {
    return {
      people: this.props.models.recommend.get()
    };
  },
  componentDidMount: function() {
    this.addChangeListener("RecommendStore",this._onChange);
    AppDispatcher.dispatch({ type: ActionTypes.RECOMMEND_PEOPLE });
  },
  componentWillUnmount: function() {
    this.removeChangeListener("RecommendStore",this._onChange);
  },
  _onChange: function() {
    this.setState({
      people: this.props.models.recommend.get()
    });
  },
  render: function(){
    if(!this.state.isLoggedIn || this.state.people.length == 0)
      return null;
    var users = {};
    this.state.people.forEach(function(p) {
      users['recommend-people-' + p._id] =
        <Row className='recommend-person'>
          <Col xs={12} >
            <div className='inbox-avatar'>
              <img src={p.avatar} width='40' height='40' style={{verticalAlign:'top',position:'relative'}} />
              <div className='inbox-avatar-name'>
                <div className='fg-darkgrayishblue75'>{p.username}</div>
              </div>
              <div className='inbox-date text-right'>
                <Follow person={p} {...this.props}></Follow>
              </div>
            </div>
          </Col>
        </Row>
    }.bind(this));
    return (
      <PanelContainer {...this.props} noControls id="recommend-people">
        <PanelHeader className='bg-orange75 fg-white '>
          <Grid>
            <Row>
              <Col xs={12}>
                <h4><Entity entity='recommendPeople'/></h4>
              </Col>
            </Row>
          </Grid>
        </PanelHeader>
        <PanelBody style={{padding: 12.5}}>
          <Grid className="recommend-people">
            {users}
          </Grid>
        </PanelBody>
      </PanelContainer>
    );
  }
});


module.exports = Recommend;