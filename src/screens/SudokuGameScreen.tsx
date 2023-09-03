// SudokuGameScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SudokuGridComponent from '../components/SudokuGridComponent';
import { generateSudokuPuzzle, Difficulty } from '../utils/SudokuGenerator';

export default function SudokuGameScreen({ route }) {
  const { difficulty } = route.params;
  const [grid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    setGrid(generateSudokuPuzzle(difficulty));
  }, [difficulty]);

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
