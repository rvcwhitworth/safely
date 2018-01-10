const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config.js');
const app = express();
const port = 4990;


const googleMapsClient = require('@google/maps').createClient({
  key: config.GOOGLE_API_KEY
});

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hi there!'));

app.get('/location', (req, res) => {
  googleMapsClient.geocode({
    address: req.query.address
  }, function(err, response) {
    if (err) {
      console.error('Error retrieving location!', err);
      res.sendStatus(400);
    } else {
      res.json(response.json.results);
    }
  })
});

app.listen(port, function() {
  console.log('listening on port,', port);
});
