import React from 'react';
import { Alert, Button, View, TextInput , Text, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.js';
import LocationInput from './LocationInput.js';
import ContactList from './ContactList.js';
import ConfirmTrip from './ConfirmTrip.js';
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

  render() {
    if (this.state.loading) {
      return (
        <AppLoading
          startAsync={this.getContacts}
          onError={console.warn}
          onFinish={this.handleFinishLoading}
        />
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
      }
    }
  }
}