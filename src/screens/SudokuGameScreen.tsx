// SudokuGameScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import SudokuGridComponent from '../components/SudokuGridComponent';
import { generateSudokuPuzzle, Difficulty } from '../utils/SudokuGenerator';

export default function SudokuGameScreen({ route }) {
  const { difficulty } = route.params;
  const [grid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    setGrid(generateSudokuPuzzle(difficulty));
  }, [difficulty]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <Text style={styles.heading}>Sudoku Game</Text>
      <SudokuGridComponent grid={grid} setGrid={setGrid} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align content at the top
    alignItems: 'center',
    paddingTop: 20, // Add some top padding if needed
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
});
