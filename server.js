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

app.get('/test', function(req, res){
  // asana.createTask(test, res);
  asana.createComment(test, res);
});

app.post('/luna-ui/pull', function(req, res) {
  if (req.body.action === 'opened') {
    console.log(req.body);
    asana.createTask(req.body, res);
  } else if (req.body.action === 'assigned') {
    console.log(req.body);
    asana.assignPull(req.body, res);
  } else if (req.body.action === 'closed') {
    console.log(req.body);
    // res.status(200).send('close pull');
    asana.closePullComment(req.body, res);
  } else {
    console.log(req.body);
    res.status(501).send('only opening and closing pull requests is supported');
  }
});

app.post('/luna-ui/comment', function(req, res) {
  console.log(req.body);
  if ('issue' in req.body) {
    asana.createIssueComment(req.body, res);
  } else {
    asana.createPullComment(req.body, res);
  }
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
