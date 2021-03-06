import React from 'react';
import { AsyncStorage, Alert, Button, View, TextInput , Text, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import config from '../config.js';
import SavedLocationList from './SavedLocationList.js';
import ModalContents from './ModalContents.js';

export default class LocationInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      address: '',
      locations: [],
      locationName: '',
      modalVisible: false
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.handleLocationNameChange = this.handleLocationNameChange.bind(this);
    this.deleteLocation = this.deleteLocation.bind(this);
    this.handleSavedSelection = this.handleSavedSelection.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  deleteLocation (location) {
    let locations = this.state.locations.slice();
    locations.splice(locations.indexOf(location), 1);
    this.setState({locations});
  }

  componentWillMount () {
    // AsyncStorage.removeItem('@safely:visited')
    AsyncStorage.getItem('@safely:visited')
    .then((visited) => {
      if (!JSON.parse(visited)) {
        this.setState({modalVisible: true});
      }
    });

    AsyncStorage.getItem('@safely:savedLocations')
    .then((locations) => {
      locations ? this.setState({
        locations: JSON.parse(locations)
      }) : this.setState({
        locations: []
      });
    })
    .catch((error) => {
      console.error('Error retrieving locations', error);
    });
  }

  handleLocationNameChange (locationName) {
    this.setState({locationName});
  }

  handleTextChange (address) {
    this.setState({address});
  }

  handleSavedSelection (location) {
    AsyncStorage.setItem('@safely:savedLocations', JSON.stringify(this.state.locations))
    .then(() => this.props.setLocation(location))
    .catch((error) => console.error('Error saving locations to storage'));
  }

  handleTextSubmit () {
    axios.get(config.URL + '/api/locations', {
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
          {text: 'Nope', onPress: () => this.setState({address: ''})},
          {text: 'That\'s it!', onPress: () => {
            if (this.state.locationName.length) {
              AsyncStorage.setItem('@safely:savedLocations',
              JSON.stringify([...this.state.locations, 
                {name: this.state.locationName, geometry: response.data[0].geometry.location, fullAddress: fullAddress}]))
              .catch((error) => console.error('Error saving location to storage'));
            }
            this.props.setLocation({geometry: response.data[0].geometry.location, fullAddress: fullAddress});
          }
        }
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

  closeModal () {
    this.setState({modalVisible: false});
    AsyncStorage.setItem('@safely:visited', JSON.stringify(true));    
  }

  render() {
    return (
      <View style={styles.container}>

        <Modal
          visible={this.state.modalVisible}
          animation={'slide'}
          onRequestClose={this.closeModal}
        >
          <ModalContents handleClose={this.closeModal}/>
        </Modal>

        <Text style={styles.text}> Ready to go home? </Text>
        <TextInput
          value={this.state.address}
          style={styles.input}
          placeholder="Point me in the right direction"
          onChangeText={this.handleTextChange.bind(this)}
          onSubmitEditingProp={this.handleTextSubmit.bind(this)}
        />
        <TextInput
          value={this.state.locationName}
          style={styles.input}
          placeholder="(optional) Name this location"
          onChangeText={this.handleLocationNameChange.bind(this)}
          onSubmitEditingProp={this.handleTextSubmit.bind(this)}
        />
        <Button 
          disabled={!this.state.address.length}
          title="Search"
          color="#1abc9c"
          onPress={this.handleTextSubmit.bind(this)}
        />
        {!!this.state.locations.length &&  <Text style={styles.savedLocations}>Saved Locations</Text>}        
        {!!this.state.locations.length &&  
          <SavedLocationList 
            deleteLocation={this.deleteLocation} 
            selectLocation={this.handleSavedSelection} 
            locations={this.state.locations}
          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 90,
    fontSize: 25,
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  text: {
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold'
  },
  savedLocations: {
    paddingTop: 20,
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    marginTop: 20,
    padding: 10,
    justifyContent: 'space-between'
  }
});
