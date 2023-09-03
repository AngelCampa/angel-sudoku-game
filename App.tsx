// App.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SudokuGrid } from './SudokuGrid';
import { generateSudokuPuzzle, Difficulty } from './SudokuGenerator';
import SudokuGridComponent from './SudokuGridComponent';

export default function App() {
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium); // Default difficulty

  useEffect(() => {
    setGrid(generateSudokuPuzzle(difficulty)); // Generate puzzle based on selected difficulty
  }, [difficulty]); // Re-generate when difficulty changes

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sudoku Game</Text>
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
});
