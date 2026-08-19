
export function dijkstraTraversal(graph, startId) {
  var frames = [];
  var distances = {};
  var previous = {};
  var visited = new Set();
  var frontier = {};

  for (var node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startId] = 0;
  frontier[startId] = 0;

  while (Object.keys(frontier).length > 0) {
    var current = null;
    var minDist = Infinity;
    for (var n in frontier) {
      if (frontier[n] < minDist) {
        minDist = frontier[n];
        current = n;
      }
    }

    if (current === null) break;
    delete frontier[current];
    visited.add(current);

    frames.push({
      visited: new Set(visited),
      current: current,
      distances: Object.assign({}, distances),
      previous: Object.assign({}, previous),
      frontier: Object.assign({}, frontier),
      path: Array.from(visited),
    });

    var neighbors = graph[current];
    if (!neighbors) continue;

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i].node;
      var weight = neighbors[i].weight;

      if (visited.has(neighbor)) continue;

      var newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        frontier[neighbor] = newDist;

        frames.push({
          visited: new Set(visited),
          current: current,
          distances: Object.assign({}, distances),
          previous: Object.assign({}, previous),
          frontier: Object.assign({}, frontier),
          path: Array.from(visited),
        });
      }
    }
  }

  return frames;
}
