import React from 'react';
import { Button, View, TextInput , Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default class LocationInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      submitted: false,
      text: ''
    }
  }

  handleTextChange (text) {
    this.setState({text});
  }

  handleTextSubmit () {

  }

  handleButtonClick () {

  }

  render() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Ready to go home? </Text>
      <TextInput
        style={styles.input}
        placeholder="Point me in the right direction"
        onChangeText={this.handleTextChange.bind(this)}
        onSubmitEditingProp={this.handleTextSubmit.bind(this)}
      />
      {this.state.location && <Button> Next </Button>}
    </View>
  );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 100,
    fontSize: 25
  },
  text: {
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold'
  },
  container: {
    marginTop: 30,
    padding: 10,
    justifyContent: 'space-between'
  }
});
