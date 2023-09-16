import React, { useEffect } from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import * as StoreReview from 'expo-store-review';
import Navigation from './src/navigation/Navigation';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      Alert.prompt(
        'Rate our app',
        'Please rate our app and let us know what you think',
        (text) => {
          if (text) {
            StoreReview.requestReview();
          }
        }
      );
    }, 600000);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: '#E5E5E5', flex: 0 }} />
      <SafeAreaView style={{ backgroundColor: '#E5E5E5', flex: 1 }}>
        <Navigation />
      </SafeAreaView>
    </View>
  );
};

export default App;
