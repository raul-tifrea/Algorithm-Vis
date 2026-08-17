export function dfsTraversal(graph, startId) {
  const frames = [];
  const visited = new Set();
  const stack = [startId];
  const path = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    path.push(node);
    frames.push({
      visited: new Set(visited),
      current: node,
      inStack: new Set(stack),
      path: [...path],
    });

    const neighbors = [...(graph[node] || [])].reverse();
    for (const neighbor of neighbors) {
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
  return frames;
}
