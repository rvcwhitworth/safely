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

app.get('/api/trips', (req, res) => {
  db.getTrip(req.query.tripId)
  .then((trip) => trip ? res.sendStatus(200) : res.sendStatus(404))
  .catch((err) => console.error('Error getting trip', err))
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
    db.getTrip(req.query.tripId)
    .then((trip) => JSON.parse(trip.contacts))
    .then((contacts) => {
      contacts.forEach((contact) => {
        let message = `Hey ${contact.name}, this is an automated message from safe.ly`  + 
        ` to inform you that ${trip.userName} has arrived home. Try the app yourself at exp.host/@rvcwhitworth/safely`;
        sendTwilioMessage(contact.phoneNumber, message);
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

app.post('/api/alert', (req, res) => {
  let location = req.body.userLocation;
  db.getTrip(req.body.tripId)
  .then((trip) => {
    JSON.parse(trip.contacts).forEach((contact) => {
      let message = `ALERT: Hello ${contact.name}, this is an automated message from safe.ly` +
      ` to inform you that ${trip.userName} has sent an alert and should be contacted immediately.` +
      ` Their current location is https://www.google.com/maps/?q=${location.coords.latitude + ',' + location.coords.longitude}.` +
      ` Try the app yourself at exp.host/@rvcwhitworth/safely`;
      sendTwilioMessage(contact.phoneNumber, message);
    });
    res.sendStatus(200);
  })
  .catch((err) => console.error('Error sending alert!', err));
});

const sendTwilioMessage = (contactNumber, message) => {
  client.messages.create({
    to: contactNumber,
    from: config.TWILIO_PHONE,
    body: message
  })
  .then((message) => console.log('Message Sent!', message.sid))
  .catch((err) => {
    console.error('Could not send message', err);
  });
};

const checkForExpiredTrips = () => {
  db.getTrips()
  .then((trips) => {
    trips.forEach((trip) => {
      if (isTripExpired(trip)) {
        let lastLocation = JSON.parse(trip.userLocation);
        JSON.parse(trip.contacts).forEach((contact) => {
          let message = `Hey ${contact.name}, this is an automated message from safe.ly` +
          ` to inform you that ${trip.userName} hasn't updated their location in half an hour.` +
          `This most likely means that their battery has died, but feel free to contact them.` +
          ` Their last location was https://www.google.com/maps/?q=${lastLocation.coords.latitude + ',' + lastLocation.coords.longitude}.`
          ` Try the app yourself at exp.host/@rvcwhitworth/safely`;
          sendTwilioMessage(contact.phoneNumber, message);
        });
        db.deleteTrip(trip._id);
      }
    });
  })
  .catch((err) => console.error('Error removing expired trips!', err));
};

const isTripExpired = (trip) => {
  return (new Date() - new Date(JSON.parse(trip.lastUpdated))) > (1000 * 60 * 30);
};

setInterval(checkForExpiredTrips, 1000 * 60);

app.listen(port, function() {
  console.log('listening on port,', port);
});
