//server related dependencies
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var port = process.env.PORT || 4545;
var asana = 'https://app.asana.com/api/1.0'

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.status(200).send('Asana Github Integration');
});


var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
