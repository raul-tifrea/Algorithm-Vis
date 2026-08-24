export function pathfindingTraversal(grid, startNode, endNode, isDijkstra = false) {
  const frames = [];
  const visited = new Set();
  let openSet = [startNode];
  
  const gScore = {};
  const fScore = {};
  const cameFrom = {};

  const getId = (node) => `${node.row}-${node.col}`;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const id = `${r}-${c}`;
      gScore[id] = Infinity;
      fScore[id] = Infinity;
    }
  }

  const startId = getId(startNode);
  const endId = getId(endNode);

  gScore[startId] = 0;
  
  const heuristic = (nodeA, nodeB) => {
    if (isDijkstra) return 0;
    
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  };

  fScore[startId] = heuristic(startNode, endNode);

  const getNeighbors = (node) => {
    const neighbors = [];
    const { row, col } = node;
    const dirs = [
      [-1, 0], 
      [0, 1],  
      [1, 0],  
      [0, -1]  
    ];
    for (let i = 0; i < dirs.length; i++) {
      const nr = row + dirs[i][0];
      const nc = col + dirs[i][1];
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
        if (!grid[nr][nc].isWall) {
          neighbors.push(grid[nr][nc]);
        }
      }
    }
    return neighbors;
  };

  while (openSet.length > 0) {
    
    let current = openSet[0];
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      const id1 = getId(openSet[i]);
      const id2 = getId(current);
      if (fScore[id1] < fScore[id2]) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    const currentId = getId(current);

    if (currentId === endId) {
      const path = [];
      let curr = currentId;
      while (cameFrom[curr]) {
        path.push(curr);
        curr = cameFrom[curr];
      }
      path.push(startId);
      path.reverse();
      
      frames.push({
        visited: new Set(visited),
        frontier: new Set(openSet.map(getId)),
        current: currentId,
        path: path
      });
      return frames;
    }

    openSet.splice(currentIndex, 1);
    visited.add(currentId);

    const neighbors = getNeighbors(current);
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      const neighborId = getId(neighbor);

      if (visited.has(neighborId)) continue;

      const tentativeGScore = gScore[currentId] + 1; 

      if (tentativeGScore < gScore[neighborId]) {
        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] = gScore[neighborId] + heuristic(neighbor, endNode);
        
        if (!openSet.find(n => getId(n) === neighborId)) {
          openSet.push(neighbor);
        }
      }
    }

    frames.push({
      visited: new Set(visited),
      frontier: new Set(openSet.map(getId)),
      current: currentId,
      path: []
    });
  }

  frames.push({
    visited: new Set(visited),
    frontier: new Set(),
    current: null,
    path: []
  });

  return frames;
}
