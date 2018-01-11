import React from 'react';
import { ScrollView, Alert, Button, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default class ConfirmTrip extends React.Component {
  constructor (props) {
    super(props);
    
    this.submitTrip = this.submitTrip.bind(this);
  }

  componentDidMount () {
   
  }

  submitTrip () {
    Alert.alert('Trip confirmed!');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Confirm Trip </Text>
        <Text> Location: {this.props.location.name ? this.props.location.name : this.props.location.fullAddress} </Text>
        <Text> Notifying: </Text>
        <ScrollView>
          {this.props.contacts.map((contact, i) => <Text key={i}>{contact.name + ' ' + contact.phoneNumber}</Text>)}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={this.props.cancelTrip}
            color="red"
          />
          <Button
            title="Confirm"
            onPress={this.submitTrip}
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
    height: 200
  },
  soloList: {
    height: 300
  }
});
