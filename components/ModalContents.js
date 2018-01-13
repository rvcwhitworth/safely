import React from 'react';
import { TextInput, AsyncStorage, View, Text, ScrollList, StyleSheet, Button } from 'react-native';

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
    this.handleTextSubmit();
    this.props.handleClose();
  }

  render () {
    console.log(styles);
    return (
      <View style={styles.modalContainer}>
        <ScrollList style={styles.list}>
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
            Enter your location and name it if you'd like to save it for future use.{'\n'}
            Select the contact(s) you'd like notified once arriving at your destination.{'\n'}
            They will be added to a saved contacts list on your next visit.{'\n'}
            After confirming your trip, we'll send a message to your contacts after arriving.{'\n'}
            Any saved locations or contacts can be removed by swiping left on the item.{'\n'}
          </Text>
          <Button
            title='Got it!'
            onPress={this.handlePress}
            color='white'
          />
        </ScrollList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  text: {
    marginTop: 5,
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 25
  },
  list: {
    flex: 1
  }
});
