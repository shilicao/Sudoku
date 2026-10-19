//validating number entries in the board. 
//No duplicate number can be allowed, rows, columns, or diagonal
export function validateEntry(board, rows, cols, entry)
{
    for (let i = 0; i < 9; i++)
    {
        if (i !== cols && board[rows][i] === entry)
            return false;
        if (i !== rows && board[i][cols] === entry)
            return false;
    }
    
    //top corner 3x3 cell
    const initialRowValue = Math.floor(rows/3)*3;
    const initialColValue = Math.floor(cols/3)*3;

    //find the rest. So board is divided into 9 pieces of 3x3. 
    for (let j = initialRowValue; j < initialRowValue + 3; j++)
    {
        for (let k = initialColValue; k < initialColValue + 3; k++)
        {
            if ((j !== rows || k !== cols) && board[j][k] === entry)
            {
                return false;
            }
        }
    }
    return true;
}