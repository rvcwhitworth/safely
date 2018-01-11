import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Swipeout from 'react-native-swipeout';

export default class SavedLocationListItem extends React.Component {
  constructor (props) {
    super(props);

    this.handleLocationClick = this.handleLocationClick.bind(this);
    this.deleteLocation = this.deleteLocation.bind(this);
  }

  deleteLocation () {
    this.props.deleteLocation(this.props.location);
  }

  handleLocationClick () {
    this.props.selectLocation(this.props.location);
  }

  render() {
    const swipeoutBtns = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => this.deleteLocation(),
        autoclose: true
      }
    ];

    return (
      <View style={styles.container}>
        <Swipeout right={swipeoutBtns}>
          <Button 
            title={this.props.location.name}
            color="#007E65"
            onPress={this.handleLocationClick}
          />
        </Swipeout>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    backgroundColor: '#fff'
  },
});