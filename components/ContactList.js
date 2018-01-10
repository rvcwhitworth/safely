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
      const fullAddress = response.data[0].formatted_address;
      Alert.alert(
        'Confirm Location',
        fullAddress,
        [
          {text: 'Nope', onPress: () => this.setState({address: ''})} ,
          {text: 'That\'s it!', onPress: () => this.props.getLocation(response.data[0].geometry.location)}
        ],
        {cancelable: false}
      );
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
        <Text style={styles.text}> Contact List </Text>
        {/* <TextInput
          value={this.state.address}
          style={styles.input}
          placeholder="Point me in the right direction"
          onChangeText={this.handleTextChange.bind(this)}
          onSubmitEditingProp={this.handleTextSubmit.bind(this)}
          autoFocus={true}
        />
        <Button 
          disabled={!this.state.address.length}
          title="Search"
          color="#1abc9c"
          onPress={this.handleTextSubmit.bind(this)}
        /> */}
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
