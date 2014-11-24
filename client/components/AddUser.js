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
      buttonEnabled: false
    }
  },
  addUser: function() {
    if (this.state.buttonEnabled) {
      var that = this;
      var asana = document.getElementById('asanaInput').value;
      var github = document.getElementById('githubInput').value;
      reqwest({
        url: 'http://127.0.0.1:4545/addUser',
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
    this.setState({
        added: e.target.value.length === 0 && this.state.added,
        error: e.target.value.length === 0 && this.state.error,
        buttonEnabled: document.getElementById('asanaInput').value.length && document.getElementById('githubInput').value.length
    });
  },
  render: function() {
    return r('div', {
      children: [
        r('h1', {}, 'Asana-github integration'),
        r('div', {}, 'Asana id:'),
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
