//server related dependencies
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');

var port = process.env.PORT || 4545;
var asana = 'https://app.asana.com/api/1.0'

//load credentials locally or from host
var credentials = {};
if (process.env.PORT===undefined) {
  credentials = require('./credentials.js');
} else {
  credentials = {
    key: process.env['key']
  };
}

console.log(credentials);

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//create functions to be used for endpoints
var createTask = function(req) {
  //sent post request to asana api endpoint '/tasks'
  //include data block

  // 'https://app.asana.com/api/1.0/users/me'

  var apiKey = new Buffer(credentials.key + ':').toString('base64');
  console.log(apiKey);

  // request.get('https://app.asana.com/api/1.0/users/me', {
  //   'auth': {
  //     'user': credentials.key,
  //     'pass': '',
  //     'sendImmediately': true
  //   }
  // }, function(err, resp, body) {
  //   console.log(err);
  //   console.log(body);
  // });

  request.post({
    url: asana + '/tasks',
    auth: {
      'user': credentials.key,
      'pass': '',
      'sendImmediately': true
    },
    form: {
      api_key: apiKey,
      assignee: credentials.assignee,
      name: 'Test task',
      workspace: credentials.workspace,
      project: credentials.project
    }
  }, function(err, resp, body) {
    console.log(err);
    console.log(body);
  });

};

app.get('/', function(req, res){
  res.status(200).send('Asana Github Integration');
});

app.get('/test', function(req, res){
  createTask();
  res.status(200).send('Asana Github Integration');
});

app.post('/luna-ui', function(req, res) {
  console.log(req.body);
  res.status(202).send();
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
