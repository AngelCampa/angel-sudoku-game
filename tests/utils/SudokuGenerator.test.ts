import { SudokuGrid, emptyGrid } from '../../src/utils/SudokuGrid'; // Adjust the import path
import {
  shuffleArray,
  isValidMove,
  generateSudokuGrid,
  generateSudokuPuzzle,
  Difficulty,
} from '../../src/utils/SudokuGenerator'; // Adjust the import path

describe('SudokuGenerator', () => {
  describe('shuffleArray', () => {
    it('should shuffle an array', () => {
      const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const shuffledArray = shuffleArray(originalArray);

      // Check if shuffledArray has the same elements as originalArray
      expect(shuffledArray).toHaveLength(originalArray.length);
      originalArray.forEach((element) => {
        expect(shuffledArray).toContain(element);
      });

      // Check if shuffledArray is not equal to originalArray
      expect(shuffledArray).not.toEqual(originalArray);
    });
  });

  describe('isValidMove', () => {
    it('should return true for a valid move in an empty grid', () => {
        const grid: SudokuGrid = emptyGrid;
      
        // Valid move: Place 1 in an empty cell (0, 0)
        expect(isValidMove(grid, 0, 0, 1)).toBe(true);
      });
      
  });

  describe('generateSudokuGrid', () => {
    it('should generate a Sudoku grid', () => {
      const grid = generateSudokuGrid();

      // You can add more test cases for generateSudokuGrid
      // Ensure that the generated grid is valid Sudoku
      // You may check rows, columns, and 3x3 squares
    });
  });

  describe('generateSudokuPuzzle', () => {
    it('should generate a Sudoku puzzle with the specified difficulty', () => {
      // You can add more test cases for generateSudokuPuzzle
      // Test with different difficulty levels (Easy, Medium, Hard)
      expect(generateSudokuPuzzle(Difficulty.Easy)).toBeTruthy();
      expect(generateSudokuPuzzle(Difficulty.Medium)).toBeTruthy();
      expect(generateSudokuPuzzle(Difficulty.Hard)).toBeTruthy();
    });
  });
});
