import { SudokuGrid, emptyGrid } from './SudokuGrid';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isValidMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) {
      return false;
    }
  }

  // Check 3x3 square
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
}

export function generateSudokuGrid(): SudokuGrid {
  const grid: SudokuGrid = JSON.parse(JSON.stringify(emptyGrid));
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const solveGrid = (): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (const num of numbers) {
            if (isValidMove(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveGrid()) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solveGrid();
  return grid;
}

export enum Difficulty {
    Easy,
    Medium,
    Hard,
  }
  
export function generateSudokuPuzzle(difficulty: Difficulty): SudokuGrid {
  const solvedGrid = generateSudokuGrid(); // Generate a complete Sudoku grid

  // Function to remove numbers based on difficulty level
  const removeNumbers = (grid: SudokuGrid, count: number): SudokuGrid => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let removedCount = 0;

    while (removedCount < count) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (newGrid[row][col] !== 0) {
        newGrid[row][col] = 0;
        removedCount++;
      }
    }

    return newGrid;
  };

  // Determine the number of cells to remove based on difficulty
  let cellsToRemove = 0;
  switch (difficulty) {
    case Difficulty.Easy:
      cellsToRemove = 35;
      break;
    case Difficulty.Medium:
      cellsToRemove = 45;
      break;
    case Difficulty.Hard:
      cellsToRemove = 55;
      break;
    default:
      cellsToRemove = 45; // Default to medium difficulty
  }

  return removeNumbers(solvedGrid, cellsToRemove);
}

export { SudokuGrid };
