import { renderBoard } from "./board.js";

const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");

// generate initial board.
renderBoard(document.querySelector("#sudoku-board"));

//theme toggle funtionality. 
function applyTheme(theme) {
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
