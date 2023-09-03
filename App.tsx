import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DifficultySelectionScreen from './src/screens/DifficultySelectionScreen'; // Adjust the path as needed
import SudokuGameScreen from './src/screens/SudokuGameScreen'; // Adjust the path as needed

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DifficultySelection">
        <Stack.Screen
          name="DifficultySelection"
          component={DifficultySelectionScreen}
          options={{ title: 'Select Difficulty' }}
        />
        <Stack.Screen
          name="SudokuGame"
          component={SudokuGameScreen}
          options={{ title: 'Sudoku Game' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
