import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Sudoku from './components/Sudoku';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku Game</Text>
      <Button title="New Game" />
      <Sudoku />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
});
