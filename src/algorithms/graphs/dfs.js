export function dfsTraversal(graph, startId) {
  var frames = [];
  var visited = new Set();
  var stack = [];
  var path = [];
  var node, i, neighbor, neighbors;

  stack.push(startId);

  while (stack.length > 0) {
    node = stack.pop();

    if (visited.has(node)) continue;
    
    visited.add(node);
    path.push(node);
    frames.push({
      visited: new Set(visited),
      current: node,
      inStack: new Set(stack),
      path: [...path],
    });

    neighbors = graph[node];
    if (neighbors) {
      // Reverse to preserve standard left-to-right visit order in our specific visualizer setup
      var reversedNeighbors = [];
      for (i = neighbors.length - 1; i >= 0; i--) {
        reversedNeighbors.push(neighbors[i]);
      }
      
      for (i = 0; i < reversedNeighbors.length; i++) {
        neighbor = reversedNeighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          frames.push({
            visited: new Set(visited),
            current: node,
            inStack: new Set(stack),
            path: [...path],
          });
        }
      }
    }
  }
  return frames;
}
