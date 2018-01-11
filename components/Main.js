import React from 'react';
import { ActivityIndicator, Alert, Button, View, TextInput , Text, StyleSheet } from 'react-native';
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
      currentView: 'LocationInput',
      loading: true
    }

    this.setLocation = this.setLocation.bind(this);
    this.handleFinishLoading = this.handleFinishLoading.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.setContacts = this.setContacts.bind(this);
    this.cancelTrip = this.cancelTrip.bind(this);
  }

  componentDidMount () {
    this.getContacts().then(() => this.handleFinishLoading());
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
        contacts: _.uniq(contacts.data.sort((a, b) => a.name.localeCompare(b.name)), 
          true, (contact) => contact.id)
      });
    }

    return Promise.all(contacts);
  }

  setLocation (location) {
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
    this.setState({
      loading: false
    });
  }

  cancelTrip () {
    this.setState({
      selectedContacts: [],
      location: null,
      currentView: 'LocationInput'
    });
  }

  confirmTrip (tripId) {
    this.setState({
      tripId: tripId,
      currentView: 'Ongoing Trip'
    });
  }

  render() {
    if (this.state.loading) {
      return (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator animating={true} size="large" color="#1abc9c" />
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
            />
          )
        case 'OngoingTrip':
          return (
            <OngoingTrip
              cancelTrip={this.cancelTrip}
              location={this.state.location}
              tripId={this.state.tripId}
            />
          )
      }
    }
  }
}

