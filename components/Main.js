import React from 'react';
import { Alert, Button, View, TextInput , Text, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.js';
import LocationInput from './LocationInput.js';
import ContactList from './ContactList.js';

export default class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentView: 'LocationInput'
    }

    this.setLocation = this.setLocation.bind(this);
  }

  setLocation (location) {
    this.setState({
      location: location,
      currentView: 'ContactList'
    });
  }

  setContacts (contacts) {
    this.setState({
      contacts: contacts,
      currentView: 'ContactList'
    });
  }

  render() {
    switch (this.state.currentView) {
      case 'LocationInput':
        return (<LocationInput setLocation={this.setLocation}/>);
      case 'ContactList':
        return (<ContactList setContacts={this.setContacts}/>);
    }
  }
}