import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Navigation from './src/navigation/Navigation';

const App = () => {
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
