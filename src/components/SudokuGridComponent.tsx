import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SudokuGrid } from '../utils/SudokuGrid';
import { isValidMove } from '../utils/SudokuGenerator';

interface SudokuGridProps {
  grid: SudokuGrid;
}

const SudokuGridComponent: React.FC<SudokuGridProps> = ({ grid }) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [error, setError] = useState<string>(''); // Initialize error state

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setError(''); // Clear any previous errors
  };

  const handleInputChange = (text: string) => {
    if (selectedCell) {
      const num = parseInt(text, 10);

      if (!isNaN(num) && num >= 1 && num <= 9) {
        if (isCorrect(selectedCell.row, selectedCell.col, num)) {
          // Update the grid with the new number
          const updatedGrid = [...grid]; // Create a copy of the grid
          updatedGrid[selectedCell.row][selectedCell.col] = num; // Update the selected cell
          // TODO: Update your grid state here (you might use a state updater function)
        } else {
          setError('Invalid number'); // Set an error message if the input is incorrect
        }
      } else {
        setError('Enter a number between 1 and 9'); // Set an error message for invalid input
      }
    }
  };

  // Implement your correctness logic here...
  const isCorrect = (row: number, col: number, num: number): boolean => {
    // Implement your correctness logic here...
    // Return true if the number is correct, false otherwise
    // You can compare it with the original solution grid or implement any other validation logic.
    // Replace this with your actual correctness logic
    return true; // Replace with your logic
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
