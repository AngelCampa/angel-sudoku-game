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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";

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

const generateSudoku = (difficulty: "easy" | "medium" | "hard") => {
  try {
    // Implement Sudoku puzzle generation logic here
    // Start with a solved Sudoku grid and remove numbers
    const solvedSudoku = generateSolvedSudoku();
    // Remove some numbers to create the puzzle (adjust difficulty levels here)
    const puzzleGrid: SudokuGrid = solvedSudoku.map((row) => [...row]);
    // Remove some numbers to increase difficulty
    // For example, in a "medium" puzzle, you can remove about 50% of the numbers
    // Adjust the removal rate as needed
    const removalRates = {
      easy: 0.3, // 30% of numbers removed
      medium: 0.5, // 50% of numbers removed
      hard: 0.7, // 70% of numbers removed
    };
    const removalRate = removalRates[difficulty];
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

type SudokuBoardProps = {
  route: RouteProp<{ params: { difficulty: "easy" | "medium" | "hard" } }>; // Define the route type
};

const SudokuBoard = ({ route }: SudokuBoardProps) => {
  const { difficulty } = route.params; // Extract the difficulty from route.params
  const [grid, setGrid] = useState<SudokuGrid>(generateSudoku(difficulty));
  const [inputMode, setInputMode] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [cellSelected, setCellSelected] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [isModalVisible, setModalVisible] = useState(false); // Add this line

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleDismissModal = () => {
    setModalVisible(false);
  };

  const HowToPlayModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>How to Play:</Text>
        <Text style={styles.modalText}>
          Select one of the numbers below the Sudoku board and then tap the cell
          where you want to put it.
        </Text>
        <Text style={styles.modalText}>General Sudoku Instructions:</Text>
        <Text style={styles.modalText}>
          Fill each row, each column, and each of the 3x3 sub-grids with all the
          numbers from 1 to 9 without repeating any numbers.
        </Text>
        <TouchableOpacity
          onPress={handleDismissModal}
          style={styles.dismissButton}
        >
          <Text style={styles.dismissButton}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
          saveGameState(grid);
        } else {
          console.log("Oops! That's not where it goes");
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
        if (
          isPlacementValid(
            grid,
            generateSolvedSudoku(),
            row,
            col,
            selectedNumber
          )
        ) {
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
      const isFilled = currentGrid.every((row) =>
        row.every((cell) => cell !== null)
      );
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

  const handleRestart = () => {
    Alert.alert(
      "Restart Sudoku",
      "Are you sure you want to restart? You will lose your progress.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Restart",
          onPress: () => {
            // Logic to reset the Sudoku grid to a new puzzle
            const newGrid = generateSudoku(difficulty); // Generate a new Sudoku grid
            setGrid(newGrid);
            setInputMode(false);
            setSelectedNumber(null);
            setCellSelected(
              Array.from({ length: 9 }, () => Array(9).fill(false))
            );
  
            // Clear the saved game state
            AsyncStorage.removeItem("sudokuGameState");
          },
        },
      ]
    );
  };  

  // Save the game state to local storage
  const saveGameState = async (gameState: SudokuGrid) => {
    try {
      const jsonGameState = JSON.stringify(gameState);
      await AsyncStorage.setItem("sudokuGameState", jsonGameState);
    } catch (error) {
      console.error("Error saving game state:", error);
    }
  };

  // Load the game state from local storage
  const loadGameState = async () => {
    try {
      const jsonGameState = await AsyncStorage.getItem("sudokuGameState");
      if (jsonGameState) {
        const gameState = JSON.parse(jsonGameState);
        setGrid(gameState);
      }
    } catch (error) {
      console.error("Error loading game state:", error);
    }
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
    loadGameState();
  }, []);

  // ...

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        {grid.map((rowData, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {rowData.map((value, colIndex) => {
              const isThickTopBorder = rowIndex % 3 === 0;
              const isThickLeftBorder = colIndex % 3 === 0;

              return (
                <TouchableOpacity
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: getCellBackgroundColor(
                        rowIndex,
                        colIndex
                      ),
                      borderTopWidth: isThickTopBorder ? 2 : 1,
                      borderLeftWidth: isThickLeftBorder ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleCellClick(rowIndex, colIndex)}
                >
                  <Text style={styles.cellText}>
                    {value !== null ? value.toString() : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.numberButtonContainer}>{numberButtons}</View>
      {/* Restart button */}
      <TouchableOpacity onPress={handleRestart}>
        <Text style={styles.restartButton}>Restart</Text>
      </TouchableOpacity>
      {/* Button to open the How to Play modal */}
      <TouchableOpacity onPress={handleOpenModal}>
        <Text style={styles.howToPlayButton}>How to Play</Text>
      </TouchableOpacity>

      {/* How to Play Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleDismissModal}
      >
        <View style={styles.modalContainer}>
          <HowToPlayModalContent />
        </View>
      </Modal>
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
  dismissButtonBackground: "#E1D5E7", // Soft lavender background for Dismiss button
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryBackground,
    flex: 1,
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
    borderWidth: 2, // Add border width for the outer square
    borderColor: colors.cellBorder, // Color for the outer square border
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 40,
    height: 40,
    borderColor: colors.cellBorder,
    borderBottomWidth: 1, // Return to the original border width
    borderRightWidth: 1, // Return to the original border width
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Added to position the squareBorder
  },
  // New style for the 3x3 squares
  squareBorder: {
    position: "absolute",
    borderColor: colors.cellBorder,
    borderWidth: 2, // Adjust the border width to make it thicker
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
  restartButton: {
    // marginTop: 170,
    marginTop: 50,
    fontSize: 18,
    backgroundColor: colors.numberButtonBackground,
    padding: 10,
    borderRadius: 10, // Adjust the border radius as needed
    color: colors.numberButtonText,
    textAlign: "center",
    fontWeight: "bold",
  },
  // New style for How to Play button
  howToPlayButton: {
    marginTop: 10,
    fontSize: 18,
    backgroundColor: colors.dismissButtonBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.numberButtonText,
  },

  // New style for modal content text
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  // New style for Dismiss button
  dismissButton: {
    backgroundColor: colors.dismissButtonBackground,
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 18,
    marginTop: 10, // Adjust the margin as needed
    color: "black",
    fontWeight: "bold",
    alignItems: "center",
    position: "relative", // Added to position the squareBorder
  },
});

export default SudokuBoard;
