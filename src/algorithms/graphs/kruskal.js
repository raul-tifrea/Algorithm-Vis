export function kruskalTraversal(graph, startId) {
  var frames = [];
  var mstEdges = [];
  var visited = new Set();
  
  var allEdges = [];
  var edgeSet = new Set();
  for (var u in graph) {
    for (var i = 0; i < graph[u].length; i++) {
      var v = graph[u][i].node;
      var w = graph[u][i].weight;
      var key = [u, v].sort().join('-');
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        allEdges.push({ u: u, v: v, weight: w });
      }
    }
  }
  
  allEdges.sort((a, b) => a.weight - b.weight);

  var parent = {};
  for (var node in graph) parent[node] = node;
  
  function find(i) {
    if (parent[i] === i) return i;
    return find(parent[i]);
  }
  function union(i, j) {
    var root_i = find(i);
    var root_j = find(j);
    if (root_i !== root_j) {
      parent[root_i] = root_j;
    }
  }

  frames.push({
    visited: new Set(),
    current: null,
    mstEdges: [],
    path: [],
  });

  for (var i = 0; i < allEdges.length; i++) {
    var edge = allEdges[i];
    var u = edge.u;
    var v = edge.v;
    
    var root_u = find(u);
    var root_v = find(v);
    
    if (root_u !== root_v) {
      union(u, v);
      mstEdges.push(edge);
      visited.add(u);
      visited.add(v);
      
      frames.push({
        visited: new Set(visited),
        current: v,
        mstEdges: [...mstEdges],
        path: Array.from(visited),
      });
    }
  }

  return frames;
}
