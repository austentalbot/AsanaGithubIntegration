//server related dependencies
var express = require('express');
var port = process.env.PORT || 4545;
var cors=require('cors');
var bodyParser = require('body-parser');

//load credentials locally or from host
var credentials = {};
if (process.env.PORT===undefined) {
  credentials = require('./credentials.js');
} else {
  credentials = {
    key: process.env['key']
  };
}

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.status(200).send('Asana Github Integration');
});

app.post('/luna-ui', function(req, res) {
  console.log(req.body);
  res.status(202).send();
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
