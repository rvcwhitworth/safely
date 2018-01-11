import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import SavedLocationListItem from './SavedLocationListItem.js';

export default class SavedLocationList extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
    <ScrollView style={styles.container}>
      {this.props.locations.map((location) =>
        <SavedLocationListItem 
          deleteLocation={this.props.deleteLocation}
          selectLocation={this.props.selectLocation} 
          location={location} 
          key={location.name + location.fullAddress}
        />)}
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    paddingTop: 5,
    backgroundColor: '#fff'
  },
});