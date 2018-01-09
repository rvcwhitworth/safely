var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var port = 4990;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hi there!'));

app.listen(port, function() {
  console.log('listening on port,', port);
});
