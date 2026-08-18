
export function bfsTraversal(graph, startId) {
  const frames = [];
  const visited = new Set();
  const queue = [startId];
  const path = [];
  visited.add(startId);

  while (queue.length > 0) {
    const node = queue.shift();
    path.push(node);
    frames.push({
      visited: new Set(visited),
      current: node,
      inQueue: new Set(queue),
      path: [...path],
    });

    for (const neighbor of (graph[node] || [])) {
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
  return frames;
}
