//recrusive backtracking algorithm to find the solution. 
import { validateEntry } from "./sudoku.js";
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
                    if (validateEntry(board, row, col, i))
                    {
                        board[row][col] = i;//a valid number to insert.
                    }
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
