# Howdy! 
Welcome to a free and open source Sudoku app created in React Native with the help of ChatGPT!

## How to run:
1. Install dependencies and start server
'''bash
yarn install
yarn start
'''
2. Download Expo Go from your phone store
3. Scan the QR Code

## TODO:
1. Eliminate all unused dependencies from package.json
2. Add a cheat "Solve Puzzle" functionality
3. If a user clicks on the wrong place, this should have 3 outcomes: 
    a. Is the right move from the solvedSudoku, so allow it
    b. Is not the right move from the solvedSudoku, but it's not illegal, so prompt that "Oops! That's not where it goes
    c. Is not a legal move, so prompt that this movement is not possible
    ### Note: I don't think this requires an alert, because that interrumpts the user flow. Think of something less invasive!