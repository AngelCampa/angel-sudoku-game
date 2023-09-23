export type SudokuGrid = (number | null)[][];

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
            const randomNumbers = Array.from({ length: 9 }, (_, index) => index + 1);
            shuffleArray(randomNumbers);
    
            for (const num of randomNumbers) {
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
    
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };  
  
    if (solve()) {
      return grid;
    } else {
      throw new Error("Failed to generate a valid Sudoku solution.");
    }
};

export const generateSudoku = (difficulty: "easy" | "medium" | "hard") => {
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

export const checkCorrectness = (grid: SudokuGrid) => {
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

export const isPlacementValid = (
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

export const checkWinningCondition = (currentGrid: SudokuGrid) => {
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