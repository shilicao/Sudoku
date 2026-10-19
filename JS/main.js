//connect function from other files. Can be seen as
//main file where board,generator,and etc as the header.
import { board } from "./board.js";
import { getPuzzle } from "./generator.js";
import { Start, getState, setCells,undo, redo, hints, reveal } from "./game_state.js";


const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");


//theme toggle funtionality. 
function applyTheme(theme) 
{
  const isDark = theme === "dark";
  root.dataset.theme = isDark ? "dark" : "light";

  if (!themeButton) return;

  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
  if (themeLabel) themeLabel.textContent = isDark ? "Dark" : "Light";
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("sudoku-theme");
} catch {
}

applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light");

themeButton?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem("sudoku-theme", nextTheme);
  } catch {
  }
});

//keeps game state sync and restores previous num if 
//invalid. 
const newBoard = document.querySelector("#sudoku-board");
 
newBoard.addEventListener("input", (event)=>
{
  const cell = event.target;
  if (!cell.matches(".cell"))
  {
    return;
  }
  //Update num in the correct position. Converts the 
  // cell’s text to a number. If it’s empty, 
  // it uses 0 to represent an empty Sudoku cell.
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  const num = cell.value === ""?0 : Number(cell.value);
  const accepted = setCells(row, col, num);
  if (!accepted)
  {
    const game = getState();
    cell.value= game.board?.[row][col] || "";
  }
});

//remembers which cell user select when click on hint
let selectedCell = null;
newBoard.addEventListener("focusin",(event)=>
{
  const position = event.target;
  if (!position.matches(".cell"))
  {
    return;
  }
  selectedCell = 
  {
    row:Number(position.dataset.row),
    column: Number(position.dataset.col)
  };
});

const startPrompt = document.querySelector("#prompt");
const difficultyButtons = document.querySelectorAll("[data-difficulty]");
difficultyButtons.forEach((button) => 
{
  button.addEventListener("click", () => 
  {
    const difficulty = button.dataset.difficulty;
    const puzzle = getPuzzle(difficulty);
    Start(difficulty, puzzle);
    const game = getState();
    board(newBoard, game.board, game.puzzle);
    newBoard.hidden = false; //generate board once the difficulty has been selected. 
    startPrompt.hidden = true; //hide once board generated.

    difficultyButtons.forEach((difficultyButtons) =>
    {
      difficultyButtons.classList.toggle("active", difficultyButtons === button);
    });
  });
});

//refresh the board
export function refresh()
{
  const game = getState();
  if (game.board)
  {
    //calls board.js to redraw the board to the page.
    board(newBoard, game.board, game.puzzle);
  }
}

//update the game state first, then redraw the board. 
document.querySelector('[aria-label = "Undo"]')?.addEventListener("click",()=>
{
  if (undo())
  {
    refresh();
  }
});
document.querySelector('[aria-label="Redo"]')?.addEventListener("click",()=>
{
  if (redo())
  {
    refresh();
  }
});

//connect gamestate all together with hint functionality.
document.querySelector("#hint-button")?.addEventListener("click", () => {
  const result = hints(
    selectedCell?.row,
    selectedCell?.column
  );

  if (!result) {
    window.alert("Start a Game");
    return;
  }

  if (result.revealAnswer) {
    window.alert("No more hints. Game over!!!");
    reveal();
    refresh();
    return;
  }

  refresh();

  const hintedCell = newBoard.querySelector(
    `[data-row="${selectedCell.row}"][data-col="${selectedCell.column}"]`
  );
  hintedCell?.focus();
});