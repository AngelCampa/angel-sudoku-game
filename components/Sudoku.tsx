import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type BoardType = number[][];

const initialBoard: BoardType = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export default function Sudoku() {
    const [boardState,setBoardState] = useState<BoardType>(initialBoard);
    const renderTile = (rowIndex: number,colIndex: number) => {
        return (
            <TextInput
                style={styles.tile}
                keyboardType="number-pad"
                maxLength={1}
                value={boardState[rowIndex][colIndex] ? boardState[rowIndex][colIndex].toString() : ''}
                onChangeText={(text) => {
                    const newBoard = [...boardState];
                    newBoard[rowIndex][colIndex] = parseInt(text) || undefined;
                    setBoardState(newBoard);
                }}
            />
        );
    };
    const renderRow = (row: number[], rowIndex: number) => {
        return (
            <View key={rowIndex} style={styles.row}>
                {row.map((tileValue,colIndex) => (
                    <View key={`${rowIndex}-${colIndex}`} style={styles.tileContainer}>
                        {renderTile(rowIndex,colIndex)}
                    </View>
                ))}
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sudoku Game</Text>
            <View style={styles.board}>{boardState.map(renderRow)}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    title:{
        fontSize:32,
        marginBottom:16,
    },
    board:{
        borderWidth:1,
        borderColor:'#000',
    },
    row:{
        flexDirection:'row',
    },
    tileContainer:{
        borderWidth:1,
        borderColor:'#000',
    },
    tile:{
        textAlign:'center',
        fontSize:24,
    },
});
