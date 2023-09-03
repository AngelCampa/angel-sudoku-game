// DifficultySelectionScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Difficulty } from '../utils/SudokuGenerator';
import { useNavigation } from '@react-navigation/native';

export default function DifficultySelectionScreen() {
  const navigation = useNavigation();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    navigation.navigate('SudokuGame', { difficulty: difficulty });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Difficulty</Text>
      <Button title="Easy" onPress={() => handleDifficultySelect(Difficulty.Easy)} />
      <Button title="Medium" onPress={() => handleDifficultySelect(Difficulty.Medium)} />
      <Button title="Hard" onPress={() => handleDifficultySelect(Difficulty.Hard)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
});
