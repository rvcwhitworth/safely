import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

export default class SavedLocationListItem extends React.Component {
  constructor (props) {
    super(props);

    this.handleLocationClick = this.handleLocationClick.bind(this);
  }

  handleLocationClick () {
    this.props.selectLocation(this.props.location.geometry);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button 
          title={this.props.location.name}
          color="#007E65"
          onPress={this.handleLocationClick}
        />
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