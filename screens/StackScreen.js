import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';

export default class StackScreen extends React.Component {
  static navigationOptions = {
    title: 'Stack',
  };

  render() {
    return (
    <ScrollView style={styles.container}>
      <Text> Stack info will be rendered here </Text>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});