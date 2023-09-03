// Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DifficultySelectionScreen from '../screens/DifficultySelectionScreen';
import SudokuGameScreen from '../screens/SudokuGameScreen';

const Stack = createStackNavigator();

export default function Navigation() {
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
