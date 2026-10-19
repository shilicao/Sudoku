const STORAGE = "sudoku-progress";
const RESUME_KEY = 1*60*1000; //1 minute allowed after leaving the page. 

//makes a copy of current board after leaving the page. 
//the max time allowed is 10 minutes. 
export function progress(gameState, time)
{
    if (!gameState || gameState.status === "idle")
    {
        return false;
    }

    const copy = //take a snapshot of every details of ongoing game state
    {
        save:Date.now(),
        time,
        game:
        {
            difficulty: gameState.difficulty,
            puzzle: gameState.puzzle,
            board:gameState.board,
            usedHints:gameState.usedHints,
            undoStack:gameState.undoStack,
            redoStack:gameState.redoStack,
            status:gameState.status
        }
    };

    //Exception handler for max allowed time.
    try
    {
        localStorage.setItem(STORAGE,JSON.stringify(copy));
        return true;
    }catch
    {
        return false;
    }
}

//a way to check the if the board is still valid after left within
//3 minutes window. 
function goodBoard(board)
{
    return (Array.isArray(board)&&
    board.length === 9 && board.every((row)=>
    Array.isArray(row) && row.length === 9 && row.every((value)=>
    Number.isInteger(value)&&value >= 0 && value <=9)));
}
//delete the snapshot or copy
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE);
  } catch {
  }
}
//if is goodm then load the snapshot where player left off. 
export function loadProgress() {
  try 
  {
    const saved = JSON.parse(localStorage.getItem(STORAGE));
    if (!saved) return null;

    const game = saved.game;
    const age = Date.now() - saved.save;

    const isValid =
      age >= 0 &&
      age <= RESUME_KEY &&
      Number.isFinite(saved.time) &&
      saved.time >= 0 &&
      game &&
      ["easy", "medium", "hard"].includes(game.difficulty) &&
      goodBoard(game.puzzle) &&
      goodBoard(game.board) &&
      Number.isInteger(game.usedHints) &&
      Array.isArray(game.undoStack) &&
      Array.isArray(game.redoStack) &&
      ["playing", "revealed"].includes(game.status);

    if (!isValid) {
      clearProgress();
      return null;
    }

    return saved;
  } catch 
  {
    clearProgress();
    return null;
  }
}