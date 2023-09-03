// App.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker from @react-native-picker/picker
import SudokuGridComponent from './components/SudokuGrid/SudokuGridComponent';
import { generateSudokuPuzzle, Difficulty } from './components/SudokuGenerator/SudokuGenerator';

export default function App() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium); // Default difficulty

  useEffect(() => {
    setGrid(generateSudokuPuzzle(difficulty)); // Generate puzzle based on selected difficulty
  }, [difficulty]); // Re-generate when difficulty changes

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sudoku Game</Text>
      <Picker
        selectedValue={difficulty}
        style={styles.picker}
        onValueChange={(itemValue) => setDifficulty(itemValue)}
      >
        <Picker.Item label="Easy" value={Difficulty.Easy} />
        <Picker.Item label="Medium" value={Difficulty.Medium} />
        <Picker.Item label="Hard" value={Difficulty.Hard} />
      </Picker>
      <SudokuGridComponent grid={grid} />
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
  picker: {
    width: 200,
    height: 40,
  },
});
