
export function bfsTraversal(graph, startId) {
  var frames = [];
  var visited = new Set();
  var queue = [];
  var path = [];
  var node, i, neighbor, neighbors;

  queue.push(startId);
  visited.add(startId);

  while (queue.length > 0) {
    node = queue.shift();
    path.push(node);
    frames.push({
      visited: new Set(visited),
      current: node,
      inQueue: new Set(queue),
      path: [...path],
    });

    neighbors = graph[node];
    if (neighbors) {
      for (i = 0; i < neighbors.length; i++) {
        neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          frames.push({
            visited: new Set(visited),
            current: node,
            inQueue: new Set(queue),
            path: [...path],
          });
        }
      }
    }
  }
  return frames;
}
