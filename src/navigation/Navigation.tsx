import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SudokuBoard from '../components/SudokuBoard';
import SelectDifficulty from '../components/SelectDifficulty';

const Stack = createStackNavigator();

const Navigation = () => {
  const screenOptions = {
    headerStyle: {
      backgroundColor: '#E5E5E5',
    },
    headerTintColor: '#333333',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectDifficulty" screenOptions={screenOptions}>
        <Stack.Screen
          name="SelectDifficulty"
          component={SelectDifficulty}
          options={{ title: 'Welcome!' }}
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
