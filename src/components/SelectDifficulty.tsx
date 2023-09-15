import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectDifficulty = () => {
  const navigation = useNavigation();

  const handleDifficultySelection = (difficulty: string) => {
    // Navigate to the Sudoku board with the selected difficulty
    navigation.navigate('SudokuBoard', { difficulty });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Difficulty</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDifficultySelection('easy')}
      >
        <Text style={styles.buttonText}>Easy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDifficultySelection('medium')}
      >
        <Text style={styles.buttonText}>Medium</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDifficultySelection('hard')}
      >
        <Text style={styles.buttonText}>Hard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E5E5', // Light gray background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333', // Dark gray text
  },
  button: {
    backgroundColor: '#AED9E0', // Light blue background for buttons
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text
  },
});

export default SelectDifficulty;
