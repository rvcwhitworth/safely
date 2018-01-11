import React from 'react';
import { StyleSheet, Text } from 'react-native';
const _ = require('underscore');

export default class ContactListItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selected : false
    }
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle () {
    this.setState({
      selected : !this.state.selected
    });

    this.props.toggleContact(this.props.contact);
  }

  render() {
    return (
      <Text
        style={this.state.selected ? styles.selectedItem : styles.item}
        onPress={this.handleToggle}
      >
        {this.props.contact.name + ' ' + this.props.contact.phoneNumbers[0].number}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  selectedItem: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});