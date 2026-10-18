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

export function board(container, puzzle = startingBoard) 
{
  if (!container) 
  {
    throw new Error("Could not find the Sudoku board container.");
  }

  container.replaceChildren();

  puzzle.forEach((row, rowIndex) => 
  {
    row.forEach((value, colIndex) => 
    {
      const cell = document.createElement("input");
      cell.type = "text";
      cell.inputMode = "numeric";
      cell.maxLength = 1;
      cell.autocomplete = "off";
      cell.className = "cell";
      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;
      cell.setAttribute(
        "aria-label",
        `Row ${rowIndex + 1}, column ${colIndex + 1}`
      );

      if (value !== 0) 
      {
        cell.value = value;
        cell.classList.add("given");
        cell.readOnly = true;
        cell.setAttribute("aria-label", `Given ${value}, row ${rowIndex + 1}, column ${colIndex + 1}`);
      }

      cell.addEventListener("input", () => 
      {
        cell.value = cell.value.replace(/[^1-9]/g, "").slice(-1);
      });

      container.appendChild(cell);
    });
  });
}
