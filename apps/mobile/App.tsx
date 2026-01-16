import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import './src/firebase';
import { mockRequests } from './src/mockData';
import { RequestDetailScreen } from './src/screens/RequestDetailScreen';

export default function App() {
  const request = mockRequests[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <RequestDetailScreen request={request} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
});
