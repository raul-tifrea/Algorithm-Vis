export function primTraversal(graph, startId) {
  var frames = [];
  var mstSet = new Set();
  var key = {};
  var parent = {};
  var frontier = {};
  var mstEdges = [];

  for (var node in graph) {
    key[node] = Infinity;
    parent[node] = null;
    frontier[node] = Infinity;
  }
  
  key[startId] = 0;
  frontier[startId] = 0;

  while (Object.keys(frontier).length > 0) {
    var u = null;
    var minKey = Infinity;
    for (var n in frontier) {
      if (frontier[n] < minKey) {
        minKey = frontier[n];
        u = n;
      }
    }

    if (u === null) break;

    delete frontier[u];
    mstSet.add(u);
    if (parent[u] !== null) {
      mstEdges.push({ u: parent[u], v: u, weight: key[u] });
    }

    frames.push({
      visited: new Set(mstSet),
      current: u,
      distances: Object.assign({}, key), // Maps to distances panel in UI
      previous: Object.assign({}, parent),
      frontier: Object.assign({}, frontier),
      mstEdges: [...mstEdges],
      path: Array.from(mstSet),
    });

    var neighbors = graph[u];
    if (!neighbors) continue;

    for (var i = 0; i < neighbors.length; i++) {
      var v = neighbors[i].node;
      var weight = neighbors[i].weight;

      if (!mstSet.has(v) && weight < key[v]) {
        parent[v] = u;
        key[v] = weight;
        frontier[v] = weight;

        frames.push({
          visited: new Set(mstSet),
          current: u,
          distances: Object.assign({}, key),
          previous: Object.assign({}, parent),
          frontier: Object.assign({}, frontier),
          mstEdges: [...mstEdges],
          path: Array.from(mstSet),
        });
      }
    }
  }

  return frames;
}
