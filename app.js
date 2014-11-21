var React = require('react');
window.React = React;

var r = React.createElement;

React.render(r('div', {
  children: [
    r('div', {}, 'Github handle:'),
    r('input', {
      type: 'text'
    }),
    r('div', {}, 'Asana id:'),
    r('input', {
      type: 'text'
    }),
    r('button', {
      className: 'button',
      onClick: function() {
        //get github handle info
        //get asana id info
        //check to make sure both fields are filled out
        //send data to server to be saved to redis
      }
    }, 'Submit')
  ]
}), document.getElementById('react'));
