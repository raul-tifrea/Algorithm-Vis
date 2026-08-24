export function dfsMaze(rows, cols) {
  const wallsToAnimate = [];
  const grid = [];

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = true;
      wallsToAnimate.push({ row: r, col: c, isWall: true }); 
    }
  }

  const visited = new Set();
  
  function getNeighbors(r, c) {
    const neighbors = [];
    if (r > 1) neighbors.push({ r: r - 2, c, dr: -1, dc: 0 });
    if (r < rows - 2) neighbors.push({ r: r + 2, c, dr: 1, dc: 0 });
    if (c > 1) neighbors.push({ r, c: c - 2, dr: 0, dc: -1 });
    if (c < cols - 2) neighbors.push({ r, c: c + 2, dr: 0, dc: 1 });
    
    return neighbors.sort(() => Math.random() - 0.5);
  }

  function carve(r, c) {
    visited.add(`${r},${c}`);
    grid[r][c] = false;
    wallsToAnimate.push({ row: r, col: c, isWall: false });

    for (let { r: nr, c: nc, dr, dc } of getNeighbors(r, c)) {
      if (!visited.has(`${nr},${nc}`)) {
        grid[r + dr][c + dc] = false;
        wallsToAnimate.push({ row: r + dr, col: c + dc, isWall: false });
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);

  return wallsToAnimate;
}
