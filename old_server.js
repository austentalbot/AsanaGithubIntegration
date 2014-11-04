//server related dependencies
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');
var moment = require('moment-timezone');

var port = process.env.PORT || 4545;
var asana = 'https://app.asana.com/api/1.0'

//load credentials locally or from host
var credentials = {};
if (process.env.PORT===undefined) {
  credentials = require('./credentials.js');
} else {
  credentials = {
    key: process.env['key'],
    defaultAsiggnee: process.env['defaultAssignee'],
    workspace: process.env['workspace'],
    project: process.env['project'],
    ghToAsana: JSON.parse(process.env['ghToAsana'])
  };
}

console.log(credentials);
//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//create functions to be used for endpoints
var createTask = function(action, res) {
  // var action = JSON.parse(req);
  var pull = {
    assignee: action.issue.assignee,
    creationDate: moment(action.issue.created_at).tz("America/Los_Angeles").format('MMMM Do YYYY, h:mm:ss a'),
    creator: action.issue.user.login,
    name: action.issue.title,
    notes: function() {
      return [
        action.comment.body,
        '\nPull by:', this.creator, 
        '\nAssigned to:',
        this.assignee || 'no one',
        '\nDate:',
        this.creationDate,
        '\nURL:',
        this.url
      ].join(' ');
    },
    url: action.issue.pull_request.html_url
  }
  request.post({
    url: asana + '/tasks',
    auth: {
      'user': credentials.key,
      'pass': '',
      'sendImmediately': true
    },
    form: {
      assignee: ghToAsana[credentials.assignee] || ghToAsana[credentials.creator] || credentials.defaultAssignee,
      name: pull.name,
      workspace: credentials.workspace,
      project: credentials.project,
      notes: pull.notes()
    }
  }, function(err, resp, body) {
    console.log(err);
    console.log(body);
    res.status(201).send();
  });
};

app.get('/', function(req, res){
  res.status(200).send('Asana Github Integration');
});

app.get('/test', function(req, res){
  createTask(req.body, res);
});

app.post('/luna-ui', function(req, res) {
  createTask(req.body, res);
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
