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
    a. That a user can see the whole solved sudoku
    b. Hint: Tap a cell and click hint. Max 3 hints per game
3. If a user clicks on the wrong place, this should have 3 outcomes: 
    a. Is the right move from the solvedSudoku, so allow it
    b. Is not the right move from the solvedSudoku, but it's not illegal, so prompt that "Oops! That's not where it goes" but this souldn't interrupt the user flow (not an alert)
    c. Is not a legal move in sudoku, so prompt that this movement is not possible with an alert
4. Add a rating feature: Prompt the user to rate the app after 10 minutes on it
5. Add a donation feature: After 20 minutes, prompt the user if they want to donate. Leave the option in the home page or somewhere where it doesn't affect the experience
6. Add app icons
7. Publish to both stores! (And Huawei store if possible)

## Future improvements!
1. Add gamification
2. Add competition features
3. Add SSO with Google and Apple