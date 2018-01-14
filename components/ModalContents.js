import React from 'react';
import { Alert, TextInput, AsyncStorage, View, Text, StyleSheet, Button } from 'react-native';

export default class ModalContents extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: ''
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  handleTextChange (name) {
    this.setState({name});
  }

  handleTextSubmit () {
    AsyncStorage.setItem('@safely:name', JSON.stringify(this.state.name));
  }

  handlePress () {
    if (this.state.name.length) {
      this.handleTextSubmit();
      this.props.handleClose();
    } else {
      Alert.alert('No name entered!', 'Please input your name.');
    }
  }

  render () {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.text}> 
          Welcome to safe.ly!{'\n'}
          Since this is your first time, please let us know what to call you:
        </Text>
        <TextInput
          value={this.state.name}
          style={styles.input}
          placeholder="Name"
          onChangeText={this.handleTextChange}
          onSubmitEditingProp={this.handleTextSubmit}
        />
        <Text style={styles.text}>
          To use our app:{'\n'}
          {'\n'}
          Enter your destination and name it if you'd like to save it for future use.{'\n'}{'\n'}
          Select the contact(s) you'd like notified once arriving at your destination.{'\n'}{'\n'}
          They will be added to a saved contacts list on your next visit.{'\n'}{'\n'}
          After confirming your trip, we'll send a message to your contacts on arrival.{'\n'}{'\n'}
          Any saved locations or contacts can be removed by swiping left on the item.{'\n'}
        </Text>
        <Button
          title='Got it!'
          onPress={this.handlePress}
          color='#1abc9c'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  text: {
    marginTop: 5,
    fontFamily: 'roboto',
    fontSize: 20,
    color: 'white'
  },
  input: {
    height: 90,
    fontSize: 25,
    textAlign: 'center',
    color: 'white'
  },
  list: {
    flex: 1
  }
});
