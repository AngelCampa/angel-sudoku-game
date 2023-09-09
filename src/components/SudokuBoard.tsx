import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";

// Define the Sudoku grid data type
type SudokuGrid = (number | null)[][];

// Helper function to shuffle an array
const shuffleArray = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

// Helper function to generate a solved Sudoku grid
const generateSolvedSudoku = () => {
  const grid: SudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(null));
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 9; i++) {
    shuffleArray(numbers);
    for (let j = 0; j < 9; j++) {
      const num = numbers[j];
      grid[i][j] = num;
    }
  }

  return grid;
};

const generateSudoku = () => {
  try {
    // Implement Sudoku puzzle generation logic here
    // Start with a solved Sudoku grid and remove numbers
    const solvedSudoku = generateSolvedSudoku();
    // Remove some numbers to create the puzzle (adjust difficulty levels here)
    const puzzleGrid: SudokuGrid = solvedSudoku.map((row) => [...row]);
    // Remove some numbers to increase difficulty
    // For example, in a "medium" puzzle, you can remove about 50% of the numbers
    // Adjust the removal rate as needed
    const removalRate = 0.5;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Math.random() < removalRate) {
          puzzleGrid[i][j] = null;
        }
      }
    }

    return puzzleGrid;
  } catch (error) {
    console.error("Error generating Sudoku puzzle:", error);
    return Array.from({ length: 9 }, () => Array(9).fill(null)); // Return an empty grid in case of an error
  }
};

const checkCorrectness = (grid: SudokuGrid) => {
  // Helper function to check for duplicates in an array
  const hasDuplicates = (arr: number[]) => {
    const seen = new Set();
    for (const num of arr) {
      if (num !== null) {
        if (seen.has(num)) {
          return true;
        }
        seen.add(num);
      }
    }
    return false;
  };

  try {
    // Check rows for duplicates
    for (let i = 0; i < 9; i++) {
      if (hasDuplicates(grid[i])) {
        return false;
      }
    }

    // Check columns for duplicates
    for (let j = 0; j < 9; j++) {
      const column = [];
      for (let i = 0; i < 9; i++) {
        column.push(grid[i][j]);
      }
      if (hasDuplicates(column)) {
        return false;
      }
    }

    // Check 3x3 boxes for duplicates
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const box = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            box.push(grid[boxRow * 3 + i][boxCol * 3 + j]);
          }
        }
        if (hasDuplicates(box)) {
          return false;
        }
      }
    }

    return true; // If no duplicates found, the puzzle is correct
  } catch (error) {
    console.error("Error checking Sudoku correctness:", error);
    return false; // Return false in case of an error
  }
};

const SudokuBoard = () => {
  const [grid, setGrid] = useState<SudokuGrid>(generateSudoku());
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [inputMode, setInputMode] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [cellSelected, setCellSelected] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );

  const handleCellClick = (row: number, col: number) => {
    // In input mode, set the selected square to the selected number
    if (inputMode && selectedNumber !== null) {
      try {
        const updatedGrid = [...grid];
        updatedGrid[row][col] = selectedNumber;
        setGrid(updatedGrid);
        setSelectedCell(null);
        setInputMode(false);
        setSelectedNumber(null);
        setCellSelected((prevCellSelected) => {
          const updatedCellSelected = [...prevCellSelected];
          updatedCellSelected[row][col] = true;
          return updatedCellSelected;
        });
        checkWinningCondition(updatedGrid);
      } catch (error) {
        console.error("Error handling cell click:", error);
      }
    } else {
      // Not in input mode, select the cell
      setSelectedCell({ row, col });
      setCellSelected((prevCellSelected) => {
        const updatedCellSelected = prevCellSelected.map((rowArray, rowIndex) =>
          rowArray.map(
            (isSelected, colIndex) => rowIndex === row && colIndex === col
          )
        );
        return updatedCellSelected;
      });
    }
  };

  const handleNumberButtonClick = (number: number) => {
    // Enable input mode and set the selected number
    setInputMode(true);
    setSelectedNumber(number);
  };

  const handleInputSubmit = () => {
    // Handle input submission
    if (selectedCell && selectedNumber !== null) {
      try {
        const updatedGrid = [...grid];
        updatedGrid[selectedCell.row][selectedCell.col] = selectedNumber;
        setGrid(updatedGrid);
        setInputMode(false);
        setSelectedNumber(null);
        setSelectedCell(null);
        checkWinningCondition(updatedGrid);
      } catch (error) {
        console.error("Error handling input submit:", error);
      }
    }
  };

  const checkWinningCondition = (currentGrid: SudokuGrid) => {
    try {
      const isCorrect = checkCorrectness(currentGrid);
      if (isCorrect) {
        Alert.alert("Congratulations!", "You solved the puzzle!");
      }
    } catch (error) {
      console.error("Error checking winning condition:", error);
    }
  };

  useEffect(() => {
    setGrid(generateSudoku());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        {grid.map((rowData, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {rowData.map((value, colIndex) => (
              <TouchableOpacity
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  selectedCell &&
                    selectedCell.row === rowIndex &&
                    selectedCell.col === colIndex &&
                    !inputMode && // Change this condition to check if not in input mode
                    styles.selectedCell,
                  {
                    backgroundColor: cellBackgroundColor({
                      row: rowIndex,
                      col: colIndex,
                    }),
                  },
                ]}
                onPress={() => handleCellClick(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{value || ""}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <Modal
          visible={selectedCell !== null && inputMode}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                value={selectedNumber !== null ? String(selectedNumber) : ""}
                onChangeText={(text) => {
                  if (/^[1-9]$/.test(text)) {
                    setSelectedNumber(parseInt(text, 10));
                  } else {
                    setSelectedNumber(null);
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter a number"
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleInputSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.numberButtonContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <TouchableOpacity
            key={`number-${number}`}
            style={[
              styles.numberButton,
              {
                opacity:
                  selectedCell &&
                  cellSelected[selectedCell.row][selectedCell.col]
                    ? 0.5
                    : 1,
              },
            ]}
            onPress={() => handleNumberButtonClick(number)}
          >
            <Text style={styles.numberButtonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const colors = {
  primaryBackground: "#E5E5E5", // Light gray background
  secondaryBackground: "#F9F8F8", // Off-white background
  primaryText: "#333333", // Dark gray text
  secondaryText: "#666666", // Medium gray text
  cellBorder: "#999999", // Light gray cell borders
  selectedCellBackground: "#F2C5A0", // Peach background for selected cell
  numberButtonBackground: "#AED9E0", // Light blue background for number buttons
  numberButtonText: "#333333", // Dark gray text for number buttons
  modalBackground: "rgba(0, 0, 0, 0.5)", // Semi-transparent black for the modal background
  modalContentBackground: "#F9F8F8", // Off-white background for modal content
  inputBorder: "#999999", // Light gray border for input field
  submitButtonBackground: "#FF6B6B", // Coral background for the submit button
  submitButtonText: "#FFFFFF", // White text for the submit button
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    backgroundColor: colors.primaryBackground,
  },
  numberButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Center horizontally with equal space
    marginTop: 30,
  },
  numberButton: {
    width: 30,
    height: 40,
    backgroundColor: colors.numberButtonBackground,
    borderColor: colors.cellBorder,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 5,
    opacity: ({ row, col }) => (cellSelected[row][col] ? 0.5 : 1), // Apply opacity based on cellSelected state
  },
  numberButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.numberButtonText,
  },
  boardContainer: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 40,
    height: 40,
    borderColor: colors.cellBorder,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCell: {
    backgroundColor: colors.selectedCellBackground,
  },
  cellText: {
    fontSize: 20,
    color: colors.primaryText,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.modalBackground,
  },
  modalContent: {
    backgroundColor: colors.modalContentBackground,
    padding: 20,
    borderRadius: 5,
    elevation: 5,
  },
  input: {
    width: 100,
    height: 40,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    marginTop: 10,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: colors.submitButtonBackground,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: colors.submitButtonText,
  },
});

export default SudokuBoard;
