//function call from other files.
import { board } from "./board.js";
import { getPuzzle } from "./generator.js";
import { Start, getState, setCells } from "./game_state.js";


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

//Difficulty selection
const newBoard = document.querySelector("#sudoku-board");
const startPrompt = document.querySelector("#prompt");
const difficultyButtons = document.querySelectorAll("[data-difficulty]");

//keeps game state sync and restores previous num if 
//invalid. 
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
  const num = cell.num === ""?0 : Number(cell.num);
  const accepted = setCells(row, col, num);
  if (!accepted)
  {
    const game = getState();
    cell.num = game.board?.[row][col] || "";
  }
});

difficultyButtons.forEach((button) => 
{
  button.addEventListener("click", () => 
  {
    const difficulty = button.dataset.difficulty;
    const puzzle = getPuzzle(difficulty);
    Start(difficulty, puzzle);
    const game = getState();
    board(newBoard, game.board);
    newBoard.hidden = false; //generate board once the difficulty has been selected. 
    startPrompt.hidden = true; //hide once board generated.

    difficultyButtons.forEach((difficultyButtons) =>
    {
      difficultyButtons.classList.toggle("active", difficultyButtons === button);
    });
  });
});