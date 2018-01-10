import React from 'react';
import { Alert, Button, View, TextInput , Text, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.js';

export default class LocationInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      address: ''
    }
  }

  handleTextChange (address) {
    this.setState({address});
  }

  handleTextSubmit () {
    axios.get(config.URL + '/location', {
      params: {
        address: this.state.address
      }
    })
    .then((response) => {
      Alert.alert('Successful response', JSON.stringify(response));
      this.setState({
        location: response
      });
    })
    .catch((error) => {
      Alert.alert(
        'No Location Found',
        'We couldn\'t find that location, try entering it again.',
        [
          {text: 'OK', onPress: () => this.setState({address: ''})}
        ],
        {cancelable: false}
      )
    });
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
        <Button 
          disabled={!this.state.address.length}
          title="Search"
          color="#1abc9c"
          onPress={this.handleTextSubmit.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 100,
    fontSize: 25,
    textAlign: 'center'
  },
  text: {
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold'
  },
  container: {
    marginTop: 70,
    padding: 10,
    justifyContent: 'space-between'
  }
});
