import React from 'react';
import { ScrollView, AsyncStorage, Alert, Button, View, FlatList , Text, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.js';
import ContactListItem from './ContactListItem.js';
const _ = require('underscore');

export default class ContactList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedContacts: [],
      savedContacts: [] 
    }

    this.submitContacts = this.submitContacts.bind(this);
    this.toggleContact = this.toggleContact.bind(this);
    this.deleteSavedContact = this.deleteSavedContact.bind(this);
  }

  componentDidMount () {
    AsyncStorage.getItem('@safely:savedContacts')
    .then((savedContacts) => {
      savedContacts ? this.setState({
        savedContacts: JSON.parse(savedContacts)
      }) : this.setState({
        savedContacts: []
      });
    })
    .catch((error) => {
      console.error('Error retrieving saved contacts', error);
    });
  }

  deleteSavedContact (contact) {
    let savedContacts = this.state.savedContacts.slice();
    savedContacts.splice(savedContacts.indexOf(contact), 1);
    this.setState({savedContacts});
    if (this.state.selectedContacts.includes(contact)) {
      this.toggleContact(contact);
    }
  }

  submitContacts () {
    if (this.state.selectedContacts.length) {
      this.addSelectedToSavedContacts();
      this.props.setContacts(this.state.selectedContacts.map((contact) => {
        return {
          id: contact.id,
          name: contact.name,
          phoneNumber: contact.phoneNumbers[0].number
        }
      }));
    } else {
      Alert.alert('No contacts selected', 'You must select at least one contact to notify!');
    }
  }
  
  toggleContact (contact) {
    if (this.state.selectedContacts.includes(contact)) {
      this.state.selectedContacts.splice(this.state.selectedContacts.indexOf(contact), 1);
    } else if (contact.phoneNumbers.length) {
      this.state.selectedContacts.push(contact);
    }
  }

  addSelectedToSavedContacts () {
    let newSavedContacts = _.uniq([...this.state.savedContacts, ...this.state.selectedContacts], false, 
      (contact) => contact.id);
  
    AsyncStorage.setItem('@safely:savedContacts',
    JSON.stringify(newSavedContacts))
    .catch((error) => console.error('Error saving contacts to storage'));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Who needs to know? </Text>

        {!!this.state.savedContacts.length &&  <Text style={styles.contactHeader}>Saved Contacts</Text>}        
        {!!this.state.savedContacts.length &&  
          <ScrollView style={styles.savedList}> 
            {this.state.savedContacts.map((contact, i) => (
              <ContactListItem 
                contact={contact}
                key={contact.id}
                toggleContact={this.toggleContact}
                saved={true}
                deleteSavedContact={this.deleteSavedContact}
              />))}
          </ScrollView>}

        <Text style={styles.contactHeader}>All Contacts</Text>
        <FlatList
          style={!!this.state.savedContacts.length ? styles.fullList : styles.soloList}
          data={this.props.contacts}
          renderItem={({item, index}) => 
            (
              <ContactListItem 
                contact={item}
                key={item.id} 
                toggleContact={this.toggleContact}
                saved={false}
              />
            )
          }
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={this.props.cancelTrip}
            color="red"
          />
          <Button
            title="Confirm"
            onPress={this.submitContacts}
            color="#1abc9c"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
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
  selectedItem: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  contactHeader: {
    paddingTop: 20,
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  savedList: {
    height: 100
  },
  fullList: {
    height: 190
  },
  soloList: {
    height: 300
  }
});
