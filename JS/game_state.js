import {solution as solvePuzzle} from "./solver.js";

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
export function hintCounter()
{
    if (!currentGame.board || currentGame.status!== "playing")
    {
        return null;
    }
    if (currentGame.usedHints < 3)
    {
        currentGame.usedHints = currentGame.usedHints + 1;
    }
    return {
        usedHints:currentGame.usedHints,
        revealAnswer: currentGame.usedHints === 3
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