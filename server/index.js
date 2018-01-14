const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config.js');
const client = require('twilio')(config.TWILIO_SID, config.TWILIO_TOKEN);
const app = express();
const port = 4990;
const db = require('./database.js');

const googleMapsClient = require('@google/maps').createClient({
  key: config.GOOGLE_API_KEY
});


app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hi there!'));

app.get('/api/locations', (req, res) => {
  googleMapsClient.geocode({
    address: req.query.address
  }, function(err, response) {
    if (err) {
      console.error('Error retrieving location!', err);
      res.sendStatus(400);
    } else {
      res.json(response.json.results);
    }
  });
});

app.post('/api/trips', (req, res) => {
  db.addNewTrip(req.body)
  .then((newTrip) => res.status(200).json({tripId: newTrip.id}))
  .catch((err) => {
    console.error('Error adding trip', err);
    res.status(500).send(err);
  });
});

app.put('/api/trips', (req, res) => {
  db.updateTrip(req.body)
  .then(() => res.sendStatus(200))
  .catch((err) => res.status(500).send(err));
});

app.delete('/api/trips', (req, res) => {
  if (req.query.arrived === 'true') {
    db.getContacts(req.query.tripId)
    .then((contacts) => {
      contacts.forEach((contact) => {
        client.messages.create({
          to: contact.phoneNumber,
          from: config.TWILIO_PHONE,
          body: `Hey ${contact.name}, this is an automated message from safe.ly to inform you that ${req.query.name} has arrived home.  Try the app yourself at exp.host/@rvcwhitworth/safely`
        })
        .then((message) => console.log('Message Sent!', message.sid))
        .catch((err) => {
          console.error('Could not send message', err);
        });
      });
    })
    .then(() => {
      db.deleteTrip(req.query.tripId)
      .then(() => res.sendStatus(200))
      .catch((err) => res.status(500).send(err));
    });
  } else {
    db.deleteTrip(req.query.tripId)
    .then(() => res.sendStatus(200))
    .catch((err) => res.status(500).send(err));
  }
});

app.listen(port, function() {
  console.log('listening on port,', port);
});
