var React = require('react/addons');
window.React = React;
var r = React.createElement;

var AddUser = require('./components/AddUser');

React.render(AddUser(), document.getElementById('react'));
