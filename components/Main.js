import React from 'react';
import { AsyncStorage, ActivityIndicator, Alert, Button, View, TextInput, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.js';
import LocationInput from './LocationInput.js';
import ContactList from './ContactList.js';
import ConfirmTrip from './ConfirmTrip.js';
import OngoingTrip from './OngoingTrip.js';
import { Contacts, Permissions, AppLoading } from 'expo';
const _ = require('underscore');

export default class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true
    }

    this.setLocation = this.setLocation.bind(this);
    this.handleFinishLoading = this.handleFinishLoading.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.setContacts = this.setContacts.bind(this);
    this.cancelTrip = this.cancelTrip.bind(this);
    this.confirmTrip = this.confirmTrip.bind(this);
  }

  componentDidMount () {
  }

  checkForOngoingTrip () {
    AsyncStorage.getItem('@safely:ongoingTrip')
    .then((trip) => {
      if (trip) {
        let tripInfo = JSON.parse(trip);

        axios.get(config.URL + '/api/trips', {
          params: {
            tripId: tripInfo.tripId
          }
        })
        .then((response) => {
          Alert.alert('Ongoing trip found!', 'Press OK to continue your trip.');
          this.setState({
            loading: false,
            location: tripInfo.location,
            tripId: tripInfo.tripId,
            selectedContacts: tripInfo.selectedContacts,
            name: tripInfo.name,
            currentView: 'OngoingTrip'
          });
        })
        .catch((err) => {
          this.setState({
            loading: false,
            currentView:'LocationInput'
          });
        })
      } else {
        this.setState({
          loading: false,
          currentView:'LocationInput'
        });
      }
    });
  }

  async getContacts () {
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    if (permission.status !== 'granted') {
      // Permission was denied...
      return;
    }
    const contacts = await Contacts.getContactsAsync({
      fields: [
        Contacts.PHONE_NUMBERS
      ]
    });

    if (contacts.total > 0) {
      this.setState({
        contacts: _.uniq(contacts.data.sort((a, b) => {
          return a.name && b.name ? a.name.localeCompare(b.name) : -1;
        }), true, (contact) => contact.id)
      });
    }

    return Promise.all(contacts);
  }

  setLocation (location) {
    AsyncStorage.getItem('@safely:name')
    .then((name) => {
      this.setState({name: JSON.parse(name)});
    })
    .catch((err) => console.error('Error retrieving name from file', err));

    this.setState({
      location: location,
      currentView: 'ContactList'
    });
  }

  setContacts (contacts) {
    this.setState({
      selectedContacts: contacts,
      currentView: 'ConfirmTrip'
    });
  }

  handleFinishLoading () {
    this.checkForOngoingTrip();
  }

  cancelTrip () {
    AsyncStorage.removeItem('@safely:ongoingTrip')
    .catch((err) => console.error('Error deleting trip from file', err));

    this.setState({
      selectedContacts: [],
      location: null,
      currentView: 'LocationInput',
      tripId: null
    });
  }

  confirmTrip (tripId) {
    let trip = {
      location: this.state.location,
      tripId: tripId,
      selectedContacts: this.state.selectedContacts,
      name: this.state.name
    }
    
    AsyncStorage.setItem('@safely:ongoingTrip', JSON.stringify(trip))
    .catch((err) => console.error('Error saving trip to file', err));

    this.setState({
      tripId: tripId,
      currentView: 'OngoingTrip'
    });
  }

  render() {
    if (this.state.loading) {
      this.getContacts().then(() => this.handleFinishLoading());            
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1abc9c" />
        </View>
      )
    } else {
      switch (this.state.currentView) {
        case 'LocationInput':
          return (<LocationInput setLocation={this.setLocation}/>);
        case 'ContactList':
          return (<ContactList cancelTrip={this.cancelTrip} contacts={this.state.contacts} setContacts={this.setContacts}/>);
        case 'ConfirmTrip':
          return (
            <ConfirmTrip 
              cancelTrip={this.cancelTrip} 
              contacts={this.state.selectedContacts} 
              location={this.state.location}
              confirmTrip={this.confirmTrip}
              name={this.state.name}
            />
          );
        case 'OngoingTrip':
          return (
            <OngoingTrip
              cancelTrip={this.cancelTrip}
              location={this.state.location}
              tripId={this.state.tripId}
              name={this.state.name}
            />
          );
        default:
          return (
            <View style={styles.loading}>
              <ActivityIndicator animating={true} size="large" color="#1abc9c" />
            </View>
          ); 
      }
    }
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1, 
    justifyContent: 'center'
  }
});