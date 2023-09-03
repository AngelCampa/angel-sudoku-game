// SudokuGridComponent.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SudokuGrid } from './SudokuGrid';

interface SudokuGridProps {
  grid: SudokuGrid;
}

const SudokuGridComponent: React.FC<SudokuGridProps> = ({ grid }) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });

  const isCorrect = (row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num && i !== col) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num && i !== row) {
        return false;
      }
    }

    // Check 3x3 square
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === num && i !== row && j !== col) {
          return false;
        }
      }
    }

    return true;
  };
  };

  return (
    <View style={styles.container}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.cell,
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex && styles.selectedCell,
              ]}
              onPress={() => handleCellPress(rowIndex, colIndex)}
            >
              <Text style={styles.cellText}>{cell !== 0 ? cell.toString() : ''}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 20,
  },
  selectedCell: {
    backgroundColor: 'lightblue',
  },
});

export default SudokuGridComponent;
