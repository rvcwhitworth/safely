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
      {this.props.locations.map((location, i) =>
        <SavedLocationListItem 
          selectLocation={this.props.selectLocation} 
          location={location} 
          key={i}
        />)}
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: '#fff'
  },
});