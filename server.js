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

app.get('/', function(req, res){
  res.status(200).send('Asana Github Integration');
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
