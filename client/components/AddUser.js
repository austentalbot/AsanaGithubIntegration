var reqwest = require('reqwest');

var React = require('react/addons');
window.React = React;
var r = React.createElement;
var cx = React.addons.classSet;

var AddUser = React.createClass({
  getInitialState: function() {
    return {
      added: false,
      error: false,
      oAuthEnabled: false,
      buttonEnabled: false
    };
  },
  asanaOAuth: function() {
    if (this.state.oAuthEnabled) {
      var that = this;
      var github = document.getElementById('githubInput').value;
      var url = 'https://app.asana.com/-/oauth_authorize?client_id=23118865654177&redirect_uri=' +
        encodeURIComponent('https://asanagh.azurewebsites.net/auth') +
        '&response_type=code' + '&state=' + github;
      window.open(url, 'AuthenticationWindow');
    }
  },
  addUser: function() {
    if (this.state.buttonEnabled) {
      var that = this;
      var asana = document.getElementById('asanaInput').value;
      var github = document.getElementById('githubInput').value;
      reqwest({
        url: 'http://asanagh.azurewebsites.net/addUser',
        method: 'post',
        data: {
          github: github,
          asana: asana
        },
        error: function(err) {
          console.log(err);
          that.setState({error: true});
        },
        success: function (resp) {
          console.log(resp);
          document.getElementById('asanaInput').value = '';
          document.getElementById('githubInput').value = '';
          that.setState({added: true});
        }
      });
    }
  },
  onInputChange: function(e) {
    var asanaInput = !!document.getElementById('asanaInput').value.length;
    var githubInput = !!document.getElementById('githubInput').value.length;
    this.setState({
      added: e.target.value.length === 0 && this.state.added,
      error: e.target.value.length === 0 && this.state.error,
      oAuthEnabled: githubInput,
      buttonEnabled: asanaInput && githubInput
    });
  },
  render: function() {
    return r('div', {
      children: [
        r('h1', {}, 'Asana github pull request integration'),
        r('div', {className: 'directions'}, 'Submit your Asana id and github handle to connect the accounts.'),
        r('div', {}, 'Asana id (get this by running "env.user().global_id" in the console):'),
        r('input', {
          type: 'text',
          id: 'asanaInput',
          onChange: this.onInputChange
        }),
        r('div', {}, 'Github handle:'),
        r('input', {
          type: 'text',
          id: 'githubInput',
          onChange: this.onInputChange
        }),
        r('button', {
          className: cx({
            'button': true,
            'button--sm': true,
            'button-block': true,
            'is-disabled': !this.state.buttonEnabled
          }),
          onClick: this.addUser
        }, 'Submit'),
        r('button', {
          className: cx({
            'button': true,
            'button--sm': true,
            'button-block': true,
            'is-disabled': !this.state.oAuthEnabled
          }),
          onClick: this.asanaOAuth
        }, 'OAuth (in development. do not use.)'),
        r('h1', {
          className: cx({'hidden': !this.state.added})
        }, 'Added new user!'),
        r('h1', {
          className: cx({'hidden': !this.state.error})
        }, 'Uh oh! Something went wrong.')
      ]
    });
  }
});

module.exports = AddUser;
