
export function bfsTraversal(graph, startId) {
  var frames = [];
  var visited = new Set();
  var queue = [];
  var path = [];
  var previous = {};
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
      previous: { ...previous },
    });

    neighbors = graph[node];
    if (neighbors) {
      for (i = 0; i < neighbors.length; i++) {
        neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            previous[neighbor] = node;
            frames.push({
              visited: new Set(visited),
              current: node,
              inQueue: new Set(queue),
              path: [...path],
              previous: { ...previous },
            });
        }
      }
    }
  }
  return frames;
}
