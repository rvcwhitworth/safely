import React from 'react';
import { ScrollView, Alert, Button, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default class OngoingTrip extends React.Component {
  constructor (props) {
    super(props);
    
    this.submitTrip = this.submitTrip.bind(this);
  }

  componentDidMount () {
  
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Ongoing Trip </Text>
        <Text> Get there safely, we'll take care of everything else! </Text>
        <Button
          title="Cancel Trip"
          onPress={this.props.cancelTrip}
          color="red"
        />
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
