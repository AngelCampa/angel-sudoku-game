import { SudokuGrid } from '../../src/components/SudokuBoard'; // Adjust the path as needed
import { generateSolvedSudoku } from '../../src/components/SudokuBoard'; // Add this import

const isValidSudoku = (grid: SudokuGrid): boolean => {
    const seenInRows = Array(9)
      .fill(null)
      .map(() => new Set<number>());
  
    const seenInCols = Array(9)
      .fill(null)
      .map(() => new Set<number>());
  
    const seenInBoxes = Array(9)
      .fill(null)
      .map(() => new Set<number>());
  
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = grid[row][col];
        if (num !== null) {
          // Check the current row
          if (seenInRows[row].has(num)) {
            return false;
          }
          seenInRows[row].add(num);
  
          // Check the current column
          if (seenInCols[col].has(num)) {
            return false;
          }
          seenInCols[col].add(num);
  
          // Check the current 3x3 box
          const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
          if (seenInBoxes[boxIndex].has(num)) {
            return false;
          }
          seenInBoxes[boxIndex].add(num);
        }
      }
    }
  
    return true;
  };
  
  const solvedSudoku = generateSolvedSudoku();

if (isValidSudoku(solvedSudoku)) {
  console.log("The solved Sudoku grid is valid.");
} else {
  console.log("The solved Sudoku grid is invalid.");
}

describe('SudokuBoard', () => {
    // ...
    test('The generated Sudoku grid is valid', () => {
        expect(isValidSudoku(solvedSudoku)).toBe(true);
    });
    });
    