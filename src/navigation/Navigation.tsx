import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SudokuBoard from '../components/SudokuBoard';
import SelectDifficulty from '../components/SelectDifficulty'; // Create this component

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectDifficulty">
        <Stack.Screen
          name="SelectDifficulty"
          component={SelectDifficulty}
          options={{ title: 'Select Difficulty' }}
        />
        <Stack.Screen
          name="SudokuBoard"
          component={SudokuBoard}
          options={{ title: 'Sudoku Board' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
