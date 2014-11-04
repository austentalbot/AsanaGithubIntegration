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
  asana.createComment(req, res);
});

app.post('/luna-ui', function(req, res) {
  if (req.body.action === 'created') {
    asana.createTask(req.body, res);
  } else {
    res.status(501).send('at the moment, only pull requests are supported by asana-gh integration');
  }
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
