import React from 'react';
import { AsyncStorage, Alert, Button, View, FlatList , Text, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.js';

export default class ContactList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedContacts: [],
      savedContacts: [] 
    }

    this.submitContacts = this.submitContacts.bind(this);
  }

  componentDidMount () {
    console.log('CONTACT PROP', this.props.contacts);
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
  
  
  
  submitContacts () {
    if (!this.state.selectedContacts.length) {
      this.addSelectedToSavedContacts();
      this.props.setContacts(this.state.selectedContacts);
    } else {
      Alert.alert('No contacts selected', 'You must select at least one contact to notify!');
    }
  }
  
  addSelectedToSavedContacts () {
    for (selectedContact of this.state.selectedContacts) {

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Who needs to know? </Text>
        <FlatList
          data={this.props.contacts}
          renderItem={({item, index}) => {
            return(<Text 
              key={item.id * index} 
              style={styles.item}
            >
              {item.name}
            </Text>)}
          }
        />
        <Button
          title="Confirm"
          onPress={this.submitContacts}
          color="#1abc9c"
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
    marginTop: 10,
    padding: 10,
    justifyContent: 'space-between'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});
