//recrusive backtracking algorithm to find the solution. 
import { validateEntry } from "./sudoku.js";
function RecrusiveBacktracking(board)
{
    //find the first cell. 
    for (let row = 0; row < 9; row++)
    {
        for (let col = 0; col < 9; col++)
        {
            if (board[row][col] === 0)
            {
                //test through each number 
                for (let i = 1; i <=9; i++)
                {
                    if (!validateEntry(board, row, col, i))
                    {
                        continue;
                    }
                    board[row][col] = i; //a valid number to insert. 
                    
                    if (RecrusiveBacktracking(board))
                    {
                        return true;
                    }
                    board[row][col] = 0; //deadend, backtracks.
                }
                return false; //no number works in this cell. 
            }
        }
    }
    return true; //solution has been found fo all cells. 
}

export function solution(puzzle)
{
    const board = puzzle.map((row)=> [...row]);
    const isGood = RecrusiveBacktracking(board);
    if (isGood)
    {
        return board;
    }
    else 
        return false;
}

// check to make sure sudoku has only one solution,because a proper 
// design board should only have one unique solution. 
export function onlySolution(puzzle, limit = 2)
{
    const board = puzzle.map((row) => [...row]);
    let count = 0; //solution counter. 

    function search()
    {
        if (count >= limit)
        {
            return;
        }

        //find the first empty cell. 
        for (let row = 0; row < 9; row++)
        {
            for (let col = 0; col < 9; col++)
            {
                if (board[row][col] === 0)
                {
                    for (let i = 1; i <= 9; i++)//insert a number from 1 to 9.
                    {
                        //if it is a valid number
                        if (validateEntry(board, row, col, i))
                        {
                            board[row][col] = i;
                            search();
                            board[row][col] = 0;
                        }
                        if (count >= limit) // means we have poorly designed board. 
                        {
                            return;
                        }
                    }
                    return;
                }
            }
        }
        count++; //one unique solution found. 
    }
    search();
    return count;
}