import {solution as solvePuzzle} from "./solver.js";
import { validateEntry } from "./sudoku.js";

let currentGame = 
{
    difficulty: null,
    puzzle: null,
    board:null, //current game state
    solution: null,
    usedHints: 0, //once it reaches three, is over.
    undoStack:[],
    redoStack:[],
    status:"idle"
};

//initializes current game state for a new puzzle.
export function Start(difficulty,puzzle)
{
    //use algorithm in solver.js to find the solution. 
    const solvedBoard = solvePuzzle(puzzle); 
    if (solvedBoard === false)
    {
        throw new Error("Unable to find a solution!");
    }
    currentGame = 
    {
        //map will copy value of every row. 
        difficulty,
        puzzle: puzzle.map((row)=>[...row]),
        board:puzzle.map((row)=>[...row]),
        solution: solvedBoard,
        usedHints: 0,
        undoStack: [],
        redoStack: [],
        status: "playing"
    };
}

//returns a copy so main.js can call it without changing 
//current game state.
export function getState()
{
    //puzzle = current board, board = player's board 
    //solution is completed board. 
    return{
        //puzzle, board, and solution will each return a 
        //copy of one board if no error. 
        difficulty:currentGame.difficulty,
        puzzle:currentGame.puzzle?.map((row)=>[...row])??null,
        board: currentGame.board?.map((row)=>[...row])??null,
        solution:currentGame.solution?.map((row)=>[...row])??null,
        usedHints:currentGame.usedHints,
        undoStack:[...currentGame.undoStack],
        redoStack:[...currentGame.redoStack],
        status: currentGame.status
    };
} 

//record what player's move or choice.
export function setCells(row, col, num)
{
    if (currentGame.status !== "playing")
    {
        return false;
    }
    if (!currentGame.board)
    {
        return false;
    }
    //make sure only digit entry from 1 to 9.
    if (!Number.isInteger(row) || !Number.isInteger(col)
    ||row<0 || row > 8 || col < 0 || col > 8||
    !Number.isInteger(num)||num < 0||num > 9)
    {
        return false;
    }

    //prevents changing starting number. 
    if (currentGame.puzzle[row][col] !== 0)
    {
        return false;
    }
    const before = currentGame.board[row][col];
    if (before === num)
    {
        return false;
    }

    //check for duplicate entry in board and column. 
    //will be use in main.js to restrain player enter
    //duplicate num. If it happens, the cell will mark red
    //and rejects what player enter. 
    if (num!== 0 && !validateEntry(currentGame.board, row, col, num))
    {
        return false;
    }
    currentGame.undoStack.push({row, col, before, after:num});
    currentGame.redoStack = [];
    currentGame.board[row][col] = num;
    return true;
}

//undo = 撤销
export function undo()
{
    if (!currentGame.board || currentGame.undoStack.length === 0)
    {
        return false;
    }
    const moves = currentGame.undoStack.pop();
    currentGame.board[moves.row][moves.col] = moves.before;
    currentGame.redoStack.push(moves);
    return true;
}

//redo = 重做
export function redo()
{
    if (!currentGame.board || currentGame.redoStack.length === 0)
    {
        return false;
    }
    const moves2 = currentGame.redoStack.pop();
    currentGame.board[moves2.row][moves2.col] = moves2.after;
    currentGame.undoStack.push(moves2);
    return true;
}

//count the number of hints. Once reaches three, 
//main.js will trigger proper function to display game over
//message and reveal full solution. 
//Before that, first two hints will display a correct number
//in a selected cell
export function hints(row, column)
{
    if (!currentGame.board || currentGame.status!== "playing")
    {
        return null;
    }
    //third hint triggers full solved puzzle
    if (currentGame.usedHints === 2)
    {
        currentGame.usedHints = currentGame.usedHints + 1;
        return {
            usedHints:currentGame.usedHints,
            revealAnswer: true
            };
    }
    //reveral correct answer in selected cell. 
    if (
    !Number.isInteger(row) ||
    !Number.isInteger(column) ||
    row < 0 || row > 8 ||
    column < 0 || column > 8 ||
    currentGame.puzzle[row][column] !== 0 ||
    currentGame.board[row][column] !== 0
  ) {
    return null;
  }
    
    const ans = currentGame.solution[row][column];
    currentGame.undoStack.push({row, col:column, before:0, after:ans});
    currentGame.redoStack = [];
    currentGame.board[row][column] = ans;
    currentGame.usedHints = currentGame.usedHints + 1;
    return{
        usedHints:currentGame.usedHints,
        revealAnswer:false
    };
}

//reveal the solved board.
export function reveal()
{
    if (!currentGame.solution)
    {
        return false;
    }
    currentGame.board = currentGame.solution.map((row)=>[...row]);
    currentGame.status = "revealed";
    return true;
}

//restore game play where people left off
export function restore(snapshot)
{
    try 
    {
        Start(snapshot.difficulty, snapshot.puzzle);
        currentGame.board = snapshot.board.map((row)=>
        [...row]);
        currentGame.usedHints = snapshot.usedHints;
        currentGame.undoStack = snapshot.undoStack.map((move)=>({...move}));
        currentGame.redoStack = snapshot.redoStack.map((moves2)=>({...moves2}));
        currentGame.status = snapshot.status;
        return true;
    }catch 
    {
        return false; 
    }
}