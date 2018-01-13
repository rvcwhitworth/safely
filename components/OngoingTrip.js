import React from 'react';
import { ScrollView, Alert, Button, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Location, Permissions } from 'expo';
import config from '../config.js';

export default class OngoingTrip extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userLocation: {
        coords: {
          latitude: 'NOT UPDATED',
          longitude: 'NOT UPDATED'
        }
      },
      delta: {
        latitude: 'n/a',
        longitude: 'n/a'
      }
    }
    this.updateLocation = this.updateLocation.bind(this);
    this.endTrip = this.endTrip.bind(this);
  }

  componentDidMount () {
    this.getUserLocation();
  }

  async getUserLocation () {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let locationSubscription = await Location.watchPositionAsync({}, this.updateLocation);
    this.setState({ locationSubscription });
  }

  updateLocation (userLocation) {
    this.setState({userLocation}, () => {
      axios.put(config.URL + '/api/trips', {tripId: this.props.tripId, userLocation: this.state.userLocation})
      .then((response) => this.compareLocation())
      .catch((err) => console.error('Error updating location', err));
    });
  }

  compareLocation () {
    let delta = {
      latitude: Math.abs(this.state.userLocation.coords.latitude - this.props.location.geometry.lat),
      longitude: Math.abs(this.state.userLocation.coords.longitude - this.props.location.geometry.lng)      
    }

    if (delta.latitude < 0.001 && delta.longitude < 0.001) this.endTrip(null, true);
  }

  endTrip (e, arrived = false) {
    axios.delete(config.URL + '/api/trips', {
      params: {
        tripId: this.props.tripId, 
        arrived: arrived
      }
    })
    .then(() => {
      if (arrived) {
        Alert.alert('You have arrived!', 'Your contacts have been notified.  Thanks for using safe.ly!');
      }
      this.props.cancelTrip();
    })
    .catch((err) => console.error('Error completing trip!', err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Ongoing Trip </Text>
        <Text style={styles.subHeader}> Get there safely, we'll take care of everything else! </Text>
        <Button
          title="Cancel Trip"
          onPress={this.endTrip}
          color="red"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    marginTop: 10,
    padding: 10,
    justifyContent: 'space-between'
  },
  subHeader: {
    paddingTop: 20,
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
