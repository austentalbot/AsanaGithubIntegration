var reqwest = require('reqwest');

var React = require('react/addons');
window.React = React;
var r = React.createElement;
var cx = React.addons.classSet;

var AddUser = React.createClass({
  getInitialState: function() {
    return {
      added: false,
      error: false
    }
  },
  addUser: function() {
    var that = this;
    var asana = document.getElementById('asanaInput').value;
    var github = document.getElementById('githubInput').value;
    if (!asana || !github) {
      alert('You must fill out both fields');
      return;
    }
    reqwest({
      url: 'http://127.0.0.1:4545/addUser',
      method: 'post',
      data: {
        github: github,
        asana: asana
      },
      error: function(err) {
        console.log(err);
      },
      success: function (resp) {
        console.log(resp);
        document.getElementById('asanaInput').value = '';
        document.getElementById('githubInput').value = '';
        that.setState({added: true});
      }
    });
  },
  onInputChange: function(e) {
    this.setState({
        added: e.target.value.length === 0 && this.state.added,
        error: e.target.value.length === 0 && this.state.error
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
          className: 'button button--sm',
          onClick: this.addUser
        }, 'Submit'),
        r('h1', {
          className: cx({'hidden': !this.state.added})
        }, 'Added new user!')
      ]
    });
  }
});

module.exports = AddUser;
