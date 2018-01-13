const mongoose = require('mongoose');
mongoose.connect('mongodb://ryan:ryan@ds251287.mlab.com:51287/safely', { useMongoClient: true });
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

let tripSchema = mongoose.Schema({
  userLocation: String,
  destination: String,
  contacts: String,
  lastUpdated: String
});

let Trip = mongoose.model('Trip', tripSchema);

const addNewTrip = ({location, contacts}) => {
  return Trip.create({
    userLocation: null,
    destination: JSON.stringify(location),
    contacts: JSON.stringify(contacts),
    lastUpdated: JSON.stringify(new Date())
  });
};

const updateTrip = ({tripId, userLocation}) => {
  return Trip.findById(tripId)
  .then((trip) => {
    return trip.update({
      userLocation: JSON.stringify(userLocation),
      lastUpdated: JSON.stringify(new Date())
    });
  });
};

const deleteTrip = (tripId) => {
  return Trip.remove({_id: tripId});
};

const getContacts = (tripId) => {
  return Trip.findById(tripId)
  .then((trip) => {
    return JSON.parse(trip.contacts);
  });
}

module.exports = {
  addNewTrip,
  updateTrip,
  deleteTrip,
  getContacts
};