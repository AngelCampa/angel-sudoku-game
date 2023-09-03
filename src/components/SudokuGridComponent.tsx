import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { SudokuGrid } from "../utils/SudokuGrid";
import { isValidMove } from "../utils/SudokuGenerator";

interface SudokuGridProps {
  grid: SudokuGrid;
  setGrid: React.Dispatch<React.SetStateAction<SudokuGrid>>;
}

const SudokuGridComponent: React.FC<SudokuGridProps> = ({ grid, setGrid }) => {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [cellValues, setCellValues] = useState<number[][]>([]);

  // Initialize cellValues based on the grid prop
  useEffect(() => {
    setCellValues([...grid]);
  }, [grid]);

  const textInputRef = useRef<TextInput | null>(null);

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });

    // Programmatically open the keyboard
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

const handleInputChange = (text: string) => {
    if (selectedCell) {
      const num = parseInt(text, 10);

      if (!isNaN(num) && num >= 1 && num <= 9) {
        if (isValidMove(cellValues, selectedCell.row, selectedCell.col, num)) {
          // Update the cell value state with the new number
          const updatedCellValues = [...cellValues];
          updatedCellValues[selectedCell.row][selectedCell.col] = num;
          setCellValues(updatedCellValues);
          setError(""); // Clear the error message
        } else {
          setError("Incorrect move!");
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={-50} // Adjust this value as needed
      style={styles.container}
    >
      {cellValues.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.cell,
                selectedCell?.row === rowIndex &&
                  selectedCell?.col === colIndex &&
                  styles.selectedCell,
              ]}
              onPress={() => handleCellPress(rowIndex, colIndex)}
            >
              <TextInput
                style={styles.cellText}
                value={
                  selectedCell?.row === rowIndex &&
                  selectedCell?.col === colIndex
                    ? ""
                    : cellValues[rowIndex][colIndex] !== 0
                    ? cellValues[rowIndex][colIndex].toString()
                    : ""
                }
                onChangeText={handleInputChange}
                keyboardType="numeric"
                maxLength={1}
                ref={textInputRef}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View>
        {error !== "" && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 40,
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 20,
  },
  selectedCell: {
    backgroundColor: "lightblue",
  },
  errorText: {
    color: "red", // Style the error text as needed
  },
});

export default SudokuGridComponent;
