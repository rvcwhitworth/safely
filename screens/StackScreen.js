import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';

export default class StackScreen extends React.Component {
  static navigationOptions = {
    title: 'Stack',
  };

  render() {
    return (
    <ScrollView style={styles.container}>
      <Text>Logo, React Native, AWS EC2, Geocode API, Twilio API </Text>
      <Text> Libraries: react-native-swipeout, react-native-contacts</Text>
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