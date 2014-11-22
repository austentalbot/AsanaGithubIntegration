var reqwest = require('reqwest');

var React = require('react');
window.React = React;
var r = React.createElement;

var AddUser = React.createClass({
  getInitialState: function() {
    return {
      added: false,
      error: false
    }
  }
  render: function() {
    return r('div', {
      children: [
        r('h1', {}, 'Asana-github integration'),
        r('div', {}, 'Asana id:'),
        r('input', {
          type: 'text',
          id: 'asanaInput'
        }),
        r('div', {}, 'Github handle:'),
        r('input', {
          type: 'text',
          id: 'githubInput'
        }),
        r('button', {
          className: 'button button--sm',
          onClick: function() {
            var asana = document.getElementById('asanaInput').value;
            var github = document.getElementById('githubInput').value;
            if (!asana || !github) {
              console.log('You must fill out both fields');
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
                this.setState({added: true});
              }
            });
          }
        }, 'Submit'),
        r('h1', {
          className: 'hidden'
        }, 'Added new user!')
      ]
    });
  }
});

module.exports = AddUser;
