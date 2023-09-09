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
export type SudokuGrid = (number | null)[][];

// Helper function to shuffle an array
export const shuffleArray = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

// Helper function to generate a solved Sudoku grid using backtracking
export const generateSolvedSudoku = () => {
  const grid: SudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(null));

  const isValidPlacement = (row: number, col: number, num: number) => {
    // Check row and column
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const solve = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(row, col, num)) {
              grid[row][col] = num;
              if (solve()) {
                return true;
              }
              grid[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  if (solve()) {
    return grid;
  } else {
    throw new Error("Failed to generate a valid Sudoku solution.");
  }
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
  const [inputMode, setInputMode] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [cellSelected, setCellSelected] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );

  const handleCellClick = (row: number, col: number) => {
    if (inputMode && selectedNumber !== null) {
      try {
        if (isPlacementValid(grid, row, col, selectedNumber)) {
          const updatedGrid = [...grid];
          updatedGrid[row][col] = selectedNumber;
          setGrid(updatedGrid);
          setInputMode(false);
          setSelectedNumber(null);
          setCellSelected((prevCellSelected) => {
            const updatedCellSelected = prevCellSelected.map(
              (rowArray) => rowArray.map(() => false) // Deselect all cells
            );
            return updatedCellSelected;
          });
          checkWinningCondition(updatedGrid);
        } else {
          // Placement is invalid, show an error message
          Alert.alert(
            "Invalid Placement",
            "The selected number violates Sudoku rules."
          );
        }
      } catch (error) {
        console.error("Error handling input submit:", error);
      }
    }
  };  

  // Update the background color logic for cells
  const getCellBackgroundColor = (row: number, col: number) => {
    if (inputMode && selectedNumber !== null) {
      if (cellSelected[row][col] && grid[row][col] === selectedNumber) {
        return colors.selectedCellBackground; // Cell is selected and contains the selected number
      }
    }
    return "transparent"; // Default transparent background
  };

  const handleNumberButtonClick = (number: number) => {
    // Enable input mode and set the selected number
    setInputMode(true);
    setSelectedNumber(number);
  };

  const isPlacementValid = (
    grid: SudokuGrid,
    row: number,
    col: number,
    number: number
  ): boolean => {
    // Check the row for duplicates
    if (grid[row].includes(number)) {
      return false;
    }
  
    // Check the column for duplicates
    if (grid.some((rowData) => rowData[col] === number)) {
      return false;
    }
  
    // Check the 3x3 box for duplicates
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    for (let i = boxStartRow; i < boxStartRow + 3; i++) {
      for (let j = boxStartCol; j < boxStartCol + 3; j++) {
        if (grid[i][j] === number) {
          return false;
        }
      }
    }
  
    return true;
  };  

  const handleInputSubmit = (row: number, col: number) => {
    // Handle input submission
    if (inputMode && selectedNumber !== null) {
      try {
        // Check if the placement is valid
        if (isPlacementValid(grid, generateSolvedSudoku(), row, col, selectedNumber)) {
          const updatedGrid = [...grid];
          updatedGrid[row][col] = selectedNumber;
          setGrid(updatedGrid);
          setInputMode(false);
          setSelectedNumber(null);
          setCellSelected((prevCellSelected) => {
            const updatedCellSelected = prevCellSelected.map(
              (rowArray) => rowArray.map(() => false) // Deselect all cells
            );
            return updatedCellSelected;
          });
          checkWinningCondition(updatedGrid);
        } else {
          // Placement is invalid, show an error message
          Alert.alert(
            "Invalid Placement",
            "The selected number violates Sudoku rules."
          );
        }
      } catch (error) {
        console.error("Error handling input submit:", error);
      }
    }
  };  

  const checkWinningCondition = (currentGrid: SudokuGrid) => {
    try {
      // Check if the puzzle is fully filled
      const isFilled = currentGrid.every((row) => row.every((cell) => cell !== null));
      if (isFilled) {
        const isCorrect = checkCorrectness(currentGrid);
        if (isCorrect) {
          Alert.alert("Congratulations!", "You solved the puzzle!");
        }
      }
    } catch (error) {
      console.error("Error checking winning condition:", error);
    }
  };  

  // Calculate the opacity for a number button
  const calculateButtonOpacity = (row: number, col: number) => {
    if (inputMode && selectedNumber !== null) {
      return cellSelected[row][col] ? 0.5 : 1;
    }
    return 1;
  };

  // Create the number buttons
  const numberButtons = [];
  for (let number = 1; number <= 9; number++) {
    numberButtons.push(
      <TouchableOpacity
        key={`number-${number}`}
        style={[
          styles.numberButton,
          {
            opacity: inputMode && selectedNumber === number ? 0.5 : 1,
          },
        ]}
        onPress={() => handleNumberButtonClick(number)}
      >
        <Text style={styles.numberButtonText}>{number}</Text>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    setGrid(generateSudoku());
  }, []);

  // ...

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
                  {
                    backgroundColor: getCellBackgroundColor(rowIndex, colIndex),
                  },
                ]}
                onPress={() => handleCellClick(rowIndex, colIndex)} // Call handleCellClick
              >
                <Text style={styles.cellText}>{value || ""}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.numberButtonContainer}>{numberButtons}</View>
    </View>
  );
};

// ...

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
    opacity: (row, col) => calculateOpacity(row, col), // Apply opacity based on conditions
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
