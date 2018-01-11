import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Swipeout from 'react-native-swipeout';
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
    const swipeoutBtns = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => this.props.deleteSavedContact(this.props.contact),
        autoclose: true
      }
    ];

    return this.props.saved ? (
        <Swipeout right={swipeoutBtns}>
          <Text
            style={this.state.selected ? styles.selectedItem : styles.item}
            onPress={this.handleToggle}
          >
          {this.props.contact.phoneNumbers.length ? this.props.contact.name + ' ' + this.props.contact.phoneNumbers[0].number 
            : this.props.contact.name + ' ' + '(N/A)'}
          </Text>
        </Swipeout>
    )
    : (
      <Text
        style={this.state.selected ? styles.selectedItem : styles.item}
        onPress={this.handleToggle}
      >
        {this.props.contact.phoneNumbers.length ? this.props.contact.name + ' ' + this.props.contact.phoneNumbers[0].number 
          : this.props.contact.name + ' ' + '(N/A)'}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  selectedItem: {
    backgroundColor: '#fff',    
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold'
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});