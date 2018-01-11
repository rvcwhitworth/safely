import React from 'react';
import { ScrollView, Alert, Button, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default class ConfirmTrip extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false
    }
    this.submitTrip = this.submitTrip.bind(this);
  }

  componentDidMount () {
   
  }

  submitTrip () {
    this.setState({
      loading: true
    }, () => {
      axios.post('/api/trips', {this.props.location, this.props.contacts}).then((response) => {
        console.log(response);
        this.setState({
          loading: false
        });
        this.props.confirmTrip(response.data.tripId);
      });
    });    
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#1abc9c" />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.text}> Confirm Trip </Text>
          <Text style={styles.subHeader}> Location:  </Text>
          <Text style={styles.locationText}>{this.props.location.name ? this.props.location.name : this.props.location.fullAddress}</Text>

          <Text style={styles.subHeader}> Notifying: </Text>
          <ScrollView style={styles.fullList}>
            {this.props.contacts.map((contact, i) => <Text style={styles.item} key={i}>{contact.name}</Text>)}
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textAlign: 'center'
  },
  subHeader: {
    paddingTop: 20,
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  locationText: {
    paddingTop: 5,
    fontFamily: 'roboto',
    textAlign: 'center',
    fontSize: 18
  },
  fullList: {
    height: 200,
  }
});
