import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SudokuGrid } from '../utils/SudokuGrid';

interface SudokuGridProps {
  grid: SudokuGrid;
}

const SudokuGridComponent: React.FC<SudokuGridProps> = ({ grid }) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [error, setError] = useState<string>('');

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setError('');
  };

  const handleInputChange = (text: string) => {
    if (selectedCell) {
      const num = parseInt(text, 10);

      if (!isNaN(num) && num >= 1 && num <= 9) {
        if (isCorrect(selectedCell.row, selectedCell.col, num)) {
          // Update the grid with the new number
          const updatedGrid = [...grid]; // Create a copy of the grid
          updatedGrid[selectedCell.row][selectedCell.col] = num; // Update the selected cell

  // Implement your correctness logic here...
  // If the number is correct, update the grid with the new number
  // If the number is incorrect, display an error message
  // Hint: Use the isCorrect() function to check if the number is correct
  // Hint: Use the setError() function to display an error message
          
        } else {
          setError('Incorrect move!');
        }
      }
    }
  };

  const isCorrect = (row: number, col: number, num: number) => {
    // Check if the number is already present in the row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) {
        return false;
      }
    }

    // Check if the number is already present in the column
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) {
        return false;
      }
    }

    // Check if the number is already present in the 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === num) {
          return false;
        }
      }
    }

    return true;
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
              <TextInput
                style={styles.cellText}
                value={cell !== 0 ? cell.toString() : ''}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                maxLength={1}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
      {error && <Text style={styles.errorText}>{error}</Text>} {/* Render error message */}
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
  errorText: {
    color: 'red', // Style the error text as needed
  },
});

export default SudokuGridComponent;
