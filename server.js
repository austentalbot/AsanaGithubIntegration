//server related dependencies
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var asana = require('./asana.js');

var port = process.env.PORT || 4545;

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//serve up client-side signup page
app.get('/', function(req, res){
  console.log('index');
  res.status(200).sendFile(__dirname + '/client/index.html');
});

app.get('/bundle.js', function(req, res){
  console.log('bundle');
  res.status(200).sendFile(__dirname + '/client/bundle.js');
});

app.get('/style-guide.min.css', function(req, res){
  console.log('style guide');
  res.status(200).sendFile(__dirname + '/node_modules/style-guide/dist/css/style-guide.min.css');
});

app.get('/style.css', function(req, res){
  console.log('css');
  res.status(200).sendFile(__dirname + '/client/style.css');
});

app.get('/auth', function(req, res) {
  console.log('auth get');
  console.log(req.query);
  if (req.query.code) {
    asana.requestOAuthAccessToken(req.query.code, req.query.state, res);
  }
});

// app.get('/authToken', function(req, res) {
//   console.log('auth token');
//   console.log(req.query);
// });

//add user to database
app.post('/addUser', function(req, res) {
  console.log('add user');
  console.log(req.body);
  asana.addUser(req, res);
});

app.post('/pull/:project', function(req, res) {
  if (req.body.action === 'opened') {
    console.log(req.body);
    asana.createTask(req, res);
  } else if (req.body.action === 'assigned') {
    console.log(req.body);
    asana.assignPull(req, res);
  } else if (req.body.action === 'closed') {
    console.log(req.body);
    asana.closePullComment(req, res);
  } else {
    console.log(req.body);
    res.status(501).send('only opening and closing pull requests is supported');
  }
});

app.post('/comment/:project', function(req, res) {
  console.log(req.body);
  if ('issue' in req.body) {
    asana.createIssueComment(req, res);
  } else {
    asana.createPullComment(req, res);
  }
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
