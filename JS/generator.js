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
    return startingBoard.map((row) => [...row]);
}