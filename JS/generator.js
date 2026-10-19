import {solution, onlySolution} from "./solver.js";

const startingBoard = [
  [0, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 0, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 3, 0, 9, 0, 0, 5],
  [0, 0, 0, 0, 0, 0, 0, 7, 9]
];

export function getPuzzle(difficulty)
{
    const allowedDiffculties = ["easy", "medium", "hard"]

    //error handle. 
    if (!allowedDiffculties.includes(difficulty))
    {
        throw new Error(`Unknown difficulty: ${difficulty}`)
    }
    const emptyCells = {easy: 30, medium:40, hard:50};
    return removeNumbers(finalSudoku(), emptyCells[difficulty]);
}

function initialSudoku()
{
    //fills the board. 0 means empty cell. 
    //will help solver.js to fill out all empty cells. 
    return Array.from ({length: 9}, ()=>Array(9).fill(0));
}
function finalSudoku()
{
    const solved = solution(initialSudoku());
    if (solved)
    {
        return solved;
    }
    else
    {
        throw new Error ("No solution!");
    }
}

//auto generate board based on selection of difficulty. 
//As difficulty increase, more number will be remove.
function removeNumbers(solvedBoard, targetCell)
{
    const puzzle = solvedBoard.map((row)=>[...row]);
    const cells = Array.from({length:81}, (_, index)=>
        ({row:Math.floor(index/9), col: index%9}))

    //Generate a list of 81 cell position. 
    for (let i = cells.length - 1; i > 0; i--)
    {
        const randomNum = Math.floor(Math.random()*(i + 1));
        [cells[i], cells[randomNum]] = [cells[randomNum], cells[i]];
    }

    //shuffle the cell, so it doesn't remove same cell
    //at the same position. 
    let removed = 0;
    for (const {row, col} of cells)
    {
        if (removed >= targetCell)
        {
            break;
        }
        const originial = puzzle[row][col];
        puzzle[row][col] = 0;
        if (onlySolution(puzzle)===1)
        {
            removed++;
        }
        else 
        {
            puzzle[row][col] = originial;
        }
    }
    return puzzle;
}