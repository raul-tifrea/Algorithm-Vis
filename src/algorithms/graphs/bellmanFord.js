export function bellmanFordTraversal(graph, startId) {
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
  visited.add(startId);
  
  var V = Object.keys(graph).length;
  
  frames.push({
    visited: new Set(visited),
    current: startId,
    distances: Object.assign({}, distances),
    previous: Object.assign({}, previous),
    frontier: {},
    path: Array.from(visited),
  });

  for (var i = 0; i < V - 1; i++) {
    var changed = false;
    for (var u in graph) {
      if (distances[u] === Infinity) continue;
      
      var neighbors = graph[u];
      for (var j = 0; j < neighbors.length; j++) {
        var v = neighbors[j].node;
        var weight = neighbors[j].weight;
        
        var newDist = distances[u] + weight;
        if (newDist < distances[v]) {
          distances[v] = newDist;
          previous[v] = u;
          changed = true;
          
          visited.add(u);
          visited.add(v);
          
          frames.push({
            visited: new Set(visited),
            current: u,
            distances: Object.assign({}, distances),
            previous: Object.assign({}, previous),
            frontier: { [v]: newDist },
            path: Array.from(visited),
          });
        }
      }
    }
    if (!changed) break;
  }

  // Final check for negative cycles
  for (var u in graph) {
    if (distances[u] === Infinity) continue;
    var neighbors = graph[u];
    for (var j = 0; j < neighbors.length; j++) {
      var v = neighbors[j].node;
      var weight = neighbors[j].weight;
      if (distances[u] + weight < distances[v]) {
        // Negative cycle detected
        frames.push({
          visited: new Set(visited),
          current: u,
          distances: Object.assign({}, distances),
          previous: Object.assign({}, previous),
          frontier: { [v]: 'CYCLE' },
          path: Array.from(visited),
        });
      }
    }
  }

  frames.push({
    visited: new Set(visited),
    current: null,
    distances: Object.assign({}, distances),
    previous: Object.assign({}, previous),
    frontier: {},
    path: Array.from(visited),
  });

  return frames;
}
