import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { bfsTraversal } from '../algorithms/graphs/bfs';
import { dfsTraversal } from '../algorithms/graphs/dfs';
import { dijkstraTraversal } from '../algorithms/graphs/dijkstra';
import { primTraversal } from '../algorithms/graphs/prim';
import { kruskalTraversal } from '../algorithms/graphs/kruskal';
import { bellmanFordTraversal } from '../algorithms/graphs/bellmanFord';
import './GraphVisualizer.css';

const DEFAULT_NODES = [
  { id: 'A', x: 350, y: 60 },
  { id: 'B', x: 180, y: 160 },
  { id: 'C', x: 520, y: 160 },
  { id: 'D', x: 80, y: 290 },
  { id: 'E', x: 280, y: 290 },
  { id: 'F', x: 430, y: 290 },
  { id: 'G', x: 620, y: 290 },
  { id: 'H', x: 180, y: 400 },
  { id: 'I', x: 490, y: 400 },
];

const DEFAULT_EDGES = [
  ['A', 'B', 4], ['A', 'C', 2],
  ['B', 'D', 5], ['B', 'E', 1],
  ['C', 'F', 8], ['C', 'G', 10],
  ['D', 'H', 2], ['E', 'H', 6],
  ['F', 'I', 3], ['G', 'I', 7],
  ['E', 'F', 4],
];

function buildGraph(nodes, edges, isDirected = false) {
  const adj = {};
  const adjWeighted = {};
  for (const n of nodes) { adj[n.id] = []; adjWeighted[n.id] = []; }
  for (const [u, v, w] of edges) {
    const weight = w ?? 1;
    adj[u].push(v);
    adjWeighted[u].push({ node: v, weight });
    if (!isDirected) {
      adj[v].push(u);
      adjWeighted[v].push({ node: u, weight });
    }
  }
  const map = Object.fromEntries(nodes.map(n => [n.id, n]));
  return { adj, adjWeighted, map };
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateRandomGraph(algo = 'bfs') {
  const count = 6 + Math.floor(Math.random() * 4); // 6 to 9 nodes
  const ids = LETTERS.slice(0, count).split('');
  const SVG_W = 700, SVG_H = 480;
  const cx = SVG_W / 2;
  const cy = SVG_H / 2;
  const rx = (SVG_W / 2) - 90;
  const ry = (SVG_H / 2) - 90;
  
  const nodes = [];
  
  // Center node with slight jitter
  nodes.push({
    id: ids[0],
    x: Math.round(cx + (Math.random() - 0.5) * 40),
    y: Math.round(cy + (Math.random() - 0.5) * 40),
  });

  const remaining = count - 1;
  const startAngle = Math.random() * Math.PI * 2;
  
  for (let i = 0; i < remaining; i++) {
    const angle = startAngle + (i / remaining) * Math.PI * 2;
    const jitterX = (Math.random() - 0.5) * 30;
    const jitterY = (Math.random() - 0.5) * 30;
    
    nodes.push({
      id: ids[i + 1],
      x: Math.round(cx + Math.cos(angle) * rx + jitterX),
      y: Math.round(cy + Math.sin(angle) * ry + jitterY),
    });
  }

  const nodeIds = nodes.map(n => n.id);
  const edges = [];
  const edgeSet = new Set();
  const addEdge = (u, v) => {
    let finalU = u;
    let finalV = v;
    if (algo === 'bellmanFord' && Math.random() > 0.5) {
      finalU = v;
      finalV = u;
    }
    const key = [finalU, finalV].sort().join('-');
    let weight = 1 + Math.floor(Math.random() * 9);
    if (algo === 'bellmanFord' && Math.random() < 0.3) {
      weight = -Math.floor(Math.random() * 5 + 1); // Negative weights for Bellman-Ford
    }
    if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([finalU, finalV, weight]); }
  };

  for (let i = 1; i < nodeIds.length; i++) {
    const j = Math.floor(Math.random() * i);
    addEdge(nodeIds[i], nodeIds[j]);
  }

  const extraCount = Math.floor(nodeIds.length * 0.5);
  for (let k = 0; k < extraCount; k++) {
    const u = nodeIds[Math.floor(Math.random() * nodeIds.length)];
    const v = nodeIds[Math.floor(Math.random() * nodeIds.length)];
    if (u !== v) addEdge(u, v);
  }

  return { nodes, edges };
}

const CODE_SNIPPETS = {
  bfs: {
    javascript: `function bfs(startNode) {
  // Use a queue to keep track of nodes to visit next
  let queue = [startNode];
  // Keep track of visited nodes to avoid cycles
  let visited = new Set([startNode]);

  while (queue.length > 0) {
    // Dequeue the first node
    let node = queue.shift();
    console.log(node);

    // Explore all neighbors
    for (let neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        // Mark as visited and enqueue
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    python: `def bfs(start_node):
    # Use a queue to keep track of nodes to visit next
    queue = [start_node]
    # Keep track of visited nodes to avoid cycles
    visited = {start_node}
    
    while queue:
        # Dequeue the first node
        node = queue.pop(0)
        print(node)
        
        # Explore all neighbors
        for neighbor in node.neighbors:
            if neighbor not in visited:
                # Mark as visited and enqueue
                visited.add(neighbor)
                queue.append(neighbor)`,
    java: `public static void bfs(Node startNode) {
    // Use a queue to keep track of nodes to visit next
    Queue<Node> queue = new LinkedList<>();
    // Keep track of visited nodes to avoid cycles
    Set<Node> visited = new HashSet<>();
    
    queue.add(startNode);
    visited.add(startNode);
    
    while (!queue.isEmpty()) {
        // Dequeue the first node
        Node node = queue.poll();
        System.out.println(node);
        
        // Explore all neighbors
        for (Node neighbor : node.neighbors) {
            if (!visited.contains(neighbor)) {
                // Mark as visited and enqueue
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
}`,
    cpp: `void bfs(Node* startNode) {
    // Use a queue to keep track of nodes to visit next
    std::queue<Node*> queue;
    // Keep track of visited nodes to avoid cycles
    std::unordered_set<Node*> visited;
    
    queue.push(startNode);
    visited.insert(startNode);
    
    while (!queue.empty()) {
        // Dequeue the first node
        Node* node = queue.front();
        queue.pop();
        std::cout << node << "\\n";
        
        // Explore all neighbors
        for (Node* neighbor : node->neighbors) {
            if (visited.find(neighbor) == visited.end()) {
                // Mark as visited and enqueue
                visited.insert(neighbor);
                queue.push(neighbor);
            }
        }
    }
}`
  },
  dfs: {
    javascript: `function dfs(startNode) {
  // Use a stack to explore as deep as possible
  let stack = [startNode];
  // Keep track of visited nodes to avoid cycles
  let visited = new Set([startNode]);

  while (stack.length > 0) {
    // Pop the last node
    let node = stack.pop();
    console.log(node);

    // Explore all neighbors
    for (let neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        // Mark as visited and push to stack
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
}`,
    python: `def dfs(start_node):
    # Use a stack to explore as deep as possible
    stack = [start_node]
    # Keep track of visited nodes to avoid cycles
    visited = {start_node}
    
    while stack:
        # Pop the last node
        node = stack.pop()
        print(node)
        
        # Explore all neighbors
        for neighbor in node.neighbors:
            if neighbor not in visited:
                # Mark as visited and push to stack
                visited.add(neighbor)
                stack.append(neighbor)`,
    java: `public static void dfs(Node startNode) {
    // Use a stack to explore as deep as possible
    Stack<Node> stack = new Stack<>();
    // Keep track of visited nodes to avoid cycles
    Set<Node> visited = new HashSet<>();
    
    stack.push(startNode);
    visited.add(startNode);
    
    while (!stack.isEmpty()) {
        // Pop the last node
        Node node = stack.pop();
        System.out.println(node);
        
        // Explore all neighbors
        for (Node neighbor : node.neighbors) {
            if (!visited.contains(neighbor)) {
                // Mark as visited and push to stack
                visited.add(neighbor);
                stack.push(neighbor);
            }
        }
    }
}`,
    cpp: `void dfs(Node* startNode) {
    // Use a stack to explore as deep as possible
    std::stack<Node*> stack;
    // Keep track of visited nodes to avoid cycles
    std::unordered_set<Node*> visited;
    
    stack.push(startNode);
    visited.insert(startNode);
    
    while (!stack.empty()) {
        // Pop the last node
        Node* node = stack.top();
        stack.pop();
        std::cout << node << "\\n";
        
        // Explore all neighbors
        for (Node* neighbor : node->neighbors) {
            if (visited.find(neighbor) == visited.end()) {
                // Mark as visited and push to stack
                visited.insert(neighbor);
                stack.push(neighbor);
            }
        }
    }
}`
  },
  dijkstra: {
    javascript: `function dijkstra(graph, start) {
  // Initialize distances to infinity
  let dist = {};
  for (let node in graph) dist[node] = Infinity;
  dist[start] = 0; // Distance to source is 0
  
  let unvisited = new Set(Object.keys(graph));
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let u = getMinDistNode(unvisited, dist);
    unvisited.delete(u);
    
    // Update distances for all neighbors
    for (let neighbor of graph[u]) {
      let alt = dist[u] + neighbor.weight;
      if (alt < dist[neighbor.node]) {
        // A shorter path to the neighbor was found
        dist[neighbor.node] = alt;
      }
    }
  }
  return dist;
}`,
    python: `def dijkstra(graph, start):
    # Initialize distances to infinity
    dist = {node: float('inf') for node in graph}
    dist[start] = 0 # Distance to source is 0
    unvisited = set(graph.keys())
    
    while unvisited:
        # Find unvisited node with minimum distance
        u = min(unvisited, key=lambda node: dist[node])
        unvisited.remove(u)
        
        # Update distances for all neighbors
        for neighbor, weight in graph[u]:
            alt = dist[u] + weight
            if alt < dist[neighbor]:
                # A shorter path to the neighbor was found
                dist[neighbor] = alt
    return dist`,
    java: `public static Map<Node, Integer> dijkstra(Graph graph, Node start) {
    // Initialize distances and priority queue
    Map<Node, Integer> dist = new HashMap<>();
    PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(dist::get));
    
    for (Node node : graph.getNodes()) dist.put(node, Integer.MAX_VALUE);
    dist.put(start, 0); // Distance to source is 0
    pq.add(start);
    
    while (!pq.isEmpty()) {
        // Extract node with minimum distance
        Node u = pq.poll();
        
        // Update distances for all neighbors
        for (Edge edge : u.getEdges()) {
            Node v = edge.getTarget();
            int alt = dist.get(u) + edge.getWeight();
            if (alt < dist.get(v)) {
                // A shorter path to the neighbor was found
                dist.put(v, alt);
                pq.add(v);
            }
        }
    }
    return dist;
}`,
    cpp: `std::map<Node*, int> dijkstra(Graph& graph, Node* start) {
    // Initialize distances and priority queue
    std::map<Node*, int> dist;
    auto cmp = [&dist](Node* a, Node* b) { return dist[a] > dist[b]; };
    std::priority_queue<Node*, std::vector<Node*>, decltype(cmp)> pq(cmp);
    
    for (Node* node : graph.nodes) dist[node] = INT_MAX;
    dist[start] = 0; // Distance to source is 0
    pq.push(start);
    
    while (!pq.empty()) {
        // Extract node with minimum distance
        Node* u = pq.top();
        pq.pop();
        
        // Update distances for all neighbors
        for (Edge& edge : u->edges) {
            Node* v = edge.target;
            int alt = dist[u] + edge.weight;
            if (alt < dist[v]) {
                // A shorter path to the neighbor was found
                dist[v] = alt;
                pq.push(v);
            }
        }
    }
    return dist;
}`
  },
  bellmanFord: {
    javascript: `function bellmanFord(graph, start) {
  // Initialize distances
  let dist = {};
  for (let node in graph) dist[node] = Infinity;
  dist[start] = 0; // Source is 0
  
  let V = Object.keys(graph).length;
  
  // Relax all edges V-1 times
  for (let i = 0; i < V - 1; i++) {
    for (let u in graph) {
      if (dist[u] === Infinity) continue;
      
      for (let neighbor of graph[u]) {
        let v = neighbor.node;
        let weight = neighbor.weight;
        
        // If a shorter path is found, update it
        if (dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
        }
      }
    }
  }
  
  // Final check for negative cycles
  for (let u in graph) {
    if (dist[u] === Infinity) continue;
    for (let neighbor of graph[u]) {
      if (dist[u] + neighbor.weight < dist[neighbor.node]) {
        console.log("Negative cycle detected!");
      }
    }
  }
  return dist;
}`,
    python: `def bellman_ford(graph, start):
    # Initialize distances
    dist = {node: float('inf') for node in graph}
    dist[start] = 0 # Source is 0
    
    # Relax all edges V-1 times
    for _ in range(len(graph) - 1):
        for u in graph:
            if dist[u] == float('inf'): continue
            
            for v, weight in graph[u]:
                # If a shorter path is found, update it
                if dist[u] + weight < dist[v]:
                    dist[v] = dist[u] + weight
                    
    # Final check for negative cycles
    for u in graph:
        if dist[u] == float('inf'): continue
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                print("Negative cycle detected!")
    return dist`,
    java: `public static Map<Node, Integer> bellmanFord(Graph graph, Node start) {
    // Initialize distances
    Map<Node, Integer> dist = new HashMap<>();
    for (Node node : graph.getNodes()) dist.put(node, Integer.MAX_VALUE);
    dist.put(start, 0);
    
    int V = graph.getNodes().size();
    
    // Relax all edges V-1 times
    for (int i = 0; i < V - 1; i++) {
        for (Node u : graph.getNodes()) {
            if (dist.get(u) == Integer.MAX_VALUE) continue;
            
            for (Edge edge : u.getEdges()) {
                Node v = edge.getTarget();
                // If a shorter path is found, update it
                if (dist.get(u) + edge.getWeight() < dist.get(v)) {
                    dist.put(v, dist.get(u) + edge.getWeight());
                }
            }
        }
    }
    
    // Final check for negative cycles
    for (Node u : graph.getNodes()) {
        if (dist.get(u) == Integer.MAX_VALUE) continue;
        for (Edge edge : u.getEdges()) {
            if (dist.get(u) + edge.getWeight() < dist.get(edge.getTarget())) {
                System.out.println("Negative cycle detected!");
            }
        }
    }
    return dist;
}`,
    cpp: `std::map<Node*, int> bellmanFord(Graph& graph, Node* start) {
    // Initialize distances
    std::map<Node*, int> dist;
    for (Node* node : graph.nodes) dist[node] = INT_MAX;
    dist[start] = 0;
    
    int V = graph.nodes.size();
    
    // Relax all edges V-1 times
    for (int i = 0; i < V - 1; i++) {
        for (Node* u : graph.nodes) {
            if (dist[u] == INT_MAX) continue;
            
            for (Edge& edge : u->edges) {
                Node* v = edge.target;
                // If a shorter path is found, update it
                if (dist[u] + edge.weight < dist[v]) {
                    dist[v] = dist[u] + edge.weight;
                }
            }
        }
    }
    
    // Final check for negative cycles
    for (Node* u : graph.nodes) {
        if (dist[u] == INT_MAX) continue;
        for (Edge& edge : u->edges) {
            if (dist[u] + edge.weight < dist[edge.target]) {
                std::cout << "Negative cycle detected!\\n";
            }
        }
    }
    return dist;
}`
  },
  prim: {
    javascript: `function prim(graph, start) {
  // Set to keep track of nodes in the Minimum Spanning Tree (MST)
  let mst = new Set();
  let key = {};
  for (let node in graph) key[node] = Infinity;
  key[start] = 0; // Start building the tree from the start node

  while (mst.size < Object.keys(graph).length) {
    // Find the node with the minimum edge weight connecting to the MST
    let u = getMinKeyNode(key, mst);
    if (!u) break;
    mst.add(u);

    // Update weights of adjacent vertices
    for (let neighbor of graph[u]) {
      if (!mst.has(neighbor.node) && neighbor.weight < key[neighbor.node]) {
        key[neighbor.node] = neighbor.weight;
      }
    }
  }
}`,
    python: `def prim(graph, start):
    # Set to keep track of nodes in the Minimum Spanning Tree (MST)
    mst = set()
    key = {node: float('inf') for node in graph}
    key[start] = 0 # Start building the tree from the start node
    
    while len(mst) < len(graph):
        # Find the node with the minimum edge weight connecting to the MST
        u = min((node for node in graph if node not in mst), key=lambda x: key[x])
        mst.add(u)
        
        # Update weights of adjacent vertices
        for neighbor, weight in graph[u]:
            if neighbor not in mst and weight < key[neighbor]:
                key[neighbor] = weight`,
    java: `public static void prim(Graph graph, Node start) {
    // Set to keep track of nodes in the Minimum Spanning Tree (MST)
    Set<Node> mst = new HashSet<>();
    Map<Node, Integer> key = new HashMap<>();
    PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(key::get));
    
    for (Node node : graph.getNodes()) key.put(node, Integer.MAX_VALUE);
    key.put(start, 0); // Start building the tree from the start node
    pq.add(start);
    
    while (!pq.isEmpty()) {
        // Find the node with the minimum edge weight connecting to the MST
        Node u = pq.poll();
        if (mst.contains(u)) continue;
        mst.add(u);
        
        // Update weights of adjacent vertices
        for (Edge edge : u.getEdges()) {
            Node v = edge.getTarget();
            if (!mst.contains(v) && edge.getWeight() < key.get(v)) {
                key.put(v, edge.getWeight());
                pq.add(v);
            }
        }
    }
}`,
    cpp: `void prim(Graph& graph, Node* start) {
    // Set to keep track of nodes in the Minimum Spanning Tree (MST)
    std::unordered_set<Node*> mst;
    std::map<Node*, int> key;
    auto cmp = [&key](Node* a, Node* b) { return key[a] > key[b]; };
    std::priority_queue<Node*, std::vector<Node*>, decltype(cmp)> pq(cmp);
    
    for (Node* node : graph.nodes) key[node] = INT_MAX;
    key[start] = 0; // Start building the tree from the start node
    pq.push(start);
    
    while (!pq.empty()) {
        // Find the node with the minimum edge weight connecting to the MST
        Node* u = pq.top();
        pq.pop();
        if (mst.count(u)) continue;
        mst.insert(u);
        
        // Update weights of adjacent vertices
        for (Edge& edge : u->edges) {
            Node* v = edge.target;
            if (!mst.count(v) && edge.weight < key[v]) {
                key[v] = edge.weight;
                pq.push(v);
            }
        }
    }
}`
  },
  kruskal: {
    javascript: `function kruskal(graph) {
  let mst = [];
  // 1. Sort all edges in non-decreasing order of their weight
  let edges = getAllEdgesSortedByWeight(graph);
  
  // 2. Initialize disjoint sets (Union-Find)
  let parent = {};
  for (let node in graph) parent[node] = node;
  
  // Helper to find root parent of a set
  function find(i) {
    if (parent[i] === i) return i;
    return find(parent[i]);
  }
  
  // 3. Process edges one by one
  for (let edge of edges) {
    let rootU = find(edge.u);
    let rootV = find(edge.v);
    
    // If including this edge doesn't form a cycle, include it
    if (rootU !== rootV) {
      parent[rootU] = rootV;
      mst.push(edge);
    }
  }
  return mst;
}`,
    python: `def kruskal(graph):
    mst = []
    # 1. Sort all edges in non-decreasing order of their weight
    edges = get_all_edges_sorted(graph)
    
    # 2. Initialize disjoint sets (Union-Find)
    parent = {node: node for node in graph}
    
    # Helper to find root parent of a set
    def find(i):
        if parent[i] == i:
            return i
        return find(parent[i])
        
    # 3. Process edges one by one
    for u, v, weight in edges:
        root_u = find(u)
        root_v = find(v)
        
        # If including this edge doesn't form a cycle, include it
        if root_u != root_v:
            parent[root_u] = root_v
            mst.append((u, v, weight))
    return mst`,
    java: `public static List<Edge> kruskal(Graph graph) {
    List<Edge> mst = new ArrayList<>();
    // 1. Sort all edges in non-decreasing order of their weight
    List<Edge> edges = graph.getAllEdges();
    Collections.sort(edges, Comparator.comparingInt(Edge::getWeight));
    
    // 2. Initialize disjoint sets (Union-Find)
    Map<Node, Node> parent = new HashMap<>();
    for (Node node : graph.getNodes()) parent.put(node, node);
    
    // 3. Process edges one by one
    for (Edge edge : edges) {
        Node rootU = find(parent, edge.getU());
        Node rootV = find(parent, edge.getV());
        
        // If including this edge doesn't form a cycle, include it
        if (!rootU.equals(rootV)) {
            parent.put(rootU, rootV);
            mst.add(edge);
        }
    }
    return mst;
}`,
    cpp: `std::vector<Edge> kruskal(Graph& graph) {
    std::vector<Edge> mst;
    // 1. Sort all edges in non-decreasing order of their weight
    std::vector<Edge> edges = graph.getAllEdges();
    std::sort(edges.begin(), edges.end(), [](Edge& a, Edge& b) { return a.weight < b.weight; });
    
    // 2. Initialize disjoint sets (Union-Find)
    std::map<Node*, Node*> parent;
    for (Node* node : graph.nodes) parent[node] = node;
    
    // 3. Process edges one by one
    for (Edge& edge : edges) {
        Node* rootU = find(parent, edge.u);
        Node* rootV = find(parent, edge.v);
        
        // If including this edge doesn't form a cycle, include it
        if (rootU != rootV) {
            parent[rootU] = rootV;
            mst.push_back(edge);
        }
    }
    return mst;
}`
  }
};

const ALGORITHMS = {
  bfs: { fn: bfsTraversal, label: 'BFS', fullLabel: 'Breadth-First Search', desc: 'Explores level by level using a queue', badge: 'badge-blue', explanation: 'Works on directed or undirected unweighted graphs. Starting from a selected node, BFS explores all of its immediate neighbors before moving to the next level neighbors. It guarantees the shortest path in an unweighted graph.' },
  dfs: { fn: dfsTraversal, label: 'DFS', fullLabel: 'Depth-First Search', desc: 'Explores as deep as possible using a stack', badge: 'badge-purple', explanation: 'Works on directed or undirected unweighted graphs. Explores as far as possible along each branch before backtracking. It uses a stack (or recursion) and is often used for topological sorting or cycle detection.' },
  dijkstra: { fn: dijkstraTraversal, label: 'Dijkstra', fullLabel: "Dijkstra's Shortest Path", desc: 'Finds shortest paths from a source using weights', badge: 'badge-yellow', explanation: 'Works on directed or undirected graphs with non-negative edge weights. Finds the shortest path from a starting node to all other reachable nodes by continually expanding the shortest known path.' },
  bellmanFord: { fn: bellmanFordTraversal, label: 'Bellman-Ford', fullLabel: 'Bellman-Ford', desc: 'Finds shortest paths, handling negative weights', badge: 'badge-red', explanation: 'Works on directed weighted graphs (can handle negative weights). Computes shortest paths from a single source vertex to all other vertices by iteratively relaxing all edges |V|-1 times.' },
  prim: { fn: primTraversal, label: 'Prim', fullLabel: "Prim's MST", desc: 'Finds Minimum Spanning Tree from a start node', badge: 'badge-green', explanation: 'Works on undirected weighted graphs. A greedy algorithm that finds a minimum spanning tree by building the tree one vertex at a time, always selecting the cheapest connection to an unvisited node.' },
  kruskal: { fn: kruskalTraversal, label: 'Kruskal', fullLabel: "Kruskal's MST", desc: 'Finds Minimum Spanning Tree by sorting edges', badge: 'badge-cyan', explanation: 'Works on undirected weighted graphs. Finds a minimum spanning tree by sorting all edges by weight and iteratively adding the smallest edge that does not form a cycle, using a Union-Find set.' },
};

const START_NODE = 'A';
const SVG_W = 700;
const SVG_H = 480;
const R = 24;

function highlight(code) {
  let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const regex = /(\/\/[^\n]*)|('[^']*'|"[^"]*")|\b(function|return|const|let|if|else|while|for|of|new|import|export|default|continue|true|false|null|def|class|public|static|void|int|bool|size_t|std|vector|auto|decltype)\b|\b(\d+)\b/g;
  
  return html.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="tok-comment">${p1}</span>`;
    if (p2) return `<span class="tok-str">${p2}</span>`;
    if (p3) return `<span class="tok-kw">${p3}</span>`;
    if (p4) return `<span class="tok-num">${p4}</span>`;
    return match;
  });
}

export default function GraphVisualizer() {
  const [algo, setAlgo] = useState('bfs');
  const [codeLang, setCodeLang] = useState('javascript');
  const [speed, setSpeed] = useState(50);
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const timerRef = useRef(null);

  const [graphNodes, setGraphNodes] = useState(DEFAULT_NODES);
  const [graphEdges, setGraphEdges] = useState(DEFAULT_EDGES);

  const isDirected = algo === 'bellmanFord';
  const { adj: ADJACENCY, adjWeighted: ADJACENCY_W, map: NODE_MAP } = buildGraph(graphNodes, graphEdges, isDirected);
  const START_NODE = graphNodes[0]?.id ?? 'A';

  function getGraphForAlgo(algoKey, adj, adjW) {
    return (algoKey === 'dijkstra' || algoKey === 'bellmanFord' || algoKey === 'prim' || algoKey === 'kruskal') ? adjW : adj;
  }

  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState([]);
  const [quizPrevious, setQuizPrevious] = useState(null);
  const [quizClicks, setQuizClicks] = useState([]);
  const [wrongNode, setWrongNode] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizTime, setQuizTime] = useState(0);
  const [quizMistakes, setQuizMistakes] = useState(0);
  const [toast, setToast] = useState(null);
  const quizStartRef = useRef(null);
  const toastTimer = useRef(null);

  const currentFrame = frames[frameIdx] ?? null;
  const visited = currentFrame?.visited ?? new Set();
  const current = currentFrame?.current ?? null;
  const distances = currentFrame?.distances ?? null;
  const previous = currentFrame?.previous ?? null;
  const dijkFrontier = currentFrame?.frontier ?? {};
  const bfsDfsFrontier = currentFrame?.inQueue ?? currentFrame?.inStack ?? new Set();
  const frontier = (algo === 'dijkstra' || algo === 'bellmanFord' || algo === 'prim') ? new Set(Object.keys(dijkFrontier)) : bfsDfsFrontier;
  const mstEdges = currentFrame?.mstEdges ?? [];
  const path = currentFrame?.path ?? [];

  function computeAnswer(algoKey, adj, adjW, startId) {
    const graphArg = getGraphForAlgo(algoKey, adj, adjW);
    const fs = ALGORITHMS[algoKey].fn(graphArg, startId);
    const order = [];
    
    if (algoKey === 'kruskal') {
      for (const f of fs) {
        if (f.mstEdges && f.mstEdges.length > order.length) {
          const newEdge = f.mstEdges[f.mstEdges.length - 1];
          const edgeStr = [newEdge.u, newEdge.v].sort().join('-');
          if (!order.includes(edgeStr)) order.push(edgeStr);
        }
      }
    } else {
      for (const f of fs) {
        if (f.current && f.previous && f.previous[f.current]) {
          const u = f.previous[f.current];
          const v = f.current;
          const edgeStr = [u, v].sort().join('-');
          if (!order.includes(edgeStr)) order.push(edgeStr);
        }
      }
    }
    return { order, previous: null };
  }

  function showToast(msg) {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  const startQuiz = useCallback(() => {
    clearInterval(timerRef.current);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
    setQuizClicks([]);
    setWrongNode(null);
    setQuizDone(false);
    setQuizMistakes(0);
    setToast(null);
    const { order, previous } = computeAnswer(algo, ADJACENCY, ADJACENCY_W, START_NODE);
    setQuizAnswer(order);
    setQuizPrevious(previous);
    setQuizMode(true);
    quizStartRef.current = Date.now();
  }, [algo, ADJACENCY, ADJACENCY_W, START_NODE]);

  const resetGraph = useCallback(() => {
    if (playing) setPlaying(false);
    clearTimeout(timerRef.current);
    
    // Pass current algo to generate negative edges if needed
    const { nodes, edges } = generateRandomGraph(algo);
    setGraphNodes(nodes);
    setGraphEdges(edges);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
    if (quizMode) {
      setQuizClicks([]);
      setWrongNode(null);
      setQuizDone(false);
      setQuizMistakes(0);
      setToast(null);
      const { adj, adjWeighted } = buildGraph(nodes, edges, isDirected);
      const startId = nodes[0]?.id ?? 'A';
      const { order, previous } = computeAnswer(algo, adj, adjWeighted, startId);
      setQuizAnswer(order);
      setQuizPrevious(previous);
      quizStartRef.current = Date.now();
    }
  }, [algo, quizMode]);

  const exitQuiz = useCallback(() => {
    setQuizMode(false);
    setQuizClicks([]);
    setWrongNode(null);
    setQuizDone(false);
    setQuizMistakes(0);
    setToast(null);
  }, []);

  const handleQuizClick = useCallback((id) => {
    if (quizDone) return;
    const nextExpected = quizAnswer[quizClicks.length];
    if (id === nextExpected) {
      const newClicks = [...quizClicks, id];
      setQuizClicks(newClicks);
      if (newClicks.length === quizAnswer.length) {
        setQuizDone(true);
        setQuizTime(Math.round((Date.now() - quizStartRef.current) / 1000));
      }
    } else {
      setQuizMistakes(m => m + 1);
      setWrongNode(id);
      setTimeout(() => setWrongNode(null), 600);
      showToast(`Wrong! The correct next edge was "${nextExpected}" — it has been placed automatically.`);
      const newClicks = [...quizClicks, nextExpected];
      setTimeout(() => {
        setQuizClicks(newClicks);
        if (newClicks.length === quizAnswer.length) {
          setQuizDone(true);
          setQuizTime(Math.round((Date.now() - quizStartRef.current) / 1000));
        }
      }, 650);
    }
  }, [quizAnswer, quizClicks, quizDone, algo]);

  const handleNodeClickWarning = useCallback(() => {
    if (!quizDone) {
      showToast("Please click on the edges, not the nodes!");
    }
  }, [quizDone]);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
  }, []);

  const play = useCallback(() => {
    if (frames.length === 0 || done) {
      const graphArg = getGraphForAlgo(algo, ADJACENCY, ADJACENCY_W);
      const f = ALGORITHMS[algo].fn(graphArg, START_NODE);
      setFrames(f);
      setFrameIdx(-1);
      setDone(false);
    }
    setPlaying(true);
  }, [frames.length, done, algo, ADJACENCY, ADJACENCY_W, START_NODE]);

  useEffect(() => {
    if (playing) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setFrameIdx(prev => {
          const next = prev + 1;
          if (next >= frames.length - 1) {
            clearInterval(timerRef.current);
            setPlaying(false);
            setDone(true);
            return frames.length - 1 > 0 ? frames.length - 1 : next;
          }
          return next;
        });
      }, Math.max(10, 1000 - speed * 9.9));
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed, frames.length]);

  const step = useCallback(() => {
    let f = frames;
    if (f.length === 0) {
      const graphArg = getGraphForAlgo(algo, ADJACENCY, ADJACENCY_W);
      f = ALGORITHMS[algo].fn(graphArg, START_NODE);
      setFrames(f);
    }
    setFrameIdx(i => {
      const next = Math.min(i + 1, f.length - 1);
      if (next === f.length - 1) setDone(true);
      return next;
    });
  }, [frames, algo, ADJACENCY, ADJACENCY_W, START_NODE]);

  const stepBack = useCallback(() => {
    setFrameIdx(i => {
      const prev = Math.max(0, i - 1);
      if (i === frames.length - 1) setDone(false);
      return prev;
    });
  }, [frames]);

  const getNodeState = (id) => {
    if (id === current) return 'current';
    if (frontier.has(id)) return 'frontier';
    if (visited.has(id)) return 'visited';
    return 'default';
  };

  const isEdgeActive = (u, v) => {
    if (algo === 'prim' || algo === 'kruskal') {
      return mstEdges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
    }
    if (previous) {
      return previous[u] === v || previous[v] === u;
    }
    return visited.has(u) && visited.has(v);
  };

  const info = ALGORITHMS[algo];
  const structLabel = algo === 'bfs' ? 'Queue' : 'Stack';

  const getQuizNodeState = (id) => {
    if (id === START_NODE && quizClicks.length >= 0) return 'correct';
    const nodeInClicks = quizClicks.some(edgeStr => edgeStr.split('-').includes(id));
    if (nodeInClicks) return 'correct';
    return 'default';
  };

  return (
    <div className="graph-vis fade-in-up">
      <div className="graph-controls card">
        <div className="ctrl-row">
          {Object.entries(ALGORITHMS).map(([key, v]) => (
            <button
              key={key}
              className={`btn btn-sm ${algo === key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { setAlgo(key); reset(); exitQuiz(); }}
              disabled={playing}
            >
              {v.label}
            </button>
          ))}
          {!quizMode
            ? <button className="btn btn-sm btn-ghost quiz-btn" onClick={startQuiz} disabled={playing || algo === 'bellmanFord'} style={{ marginLeft: '8px' }} title={algo === 'bellmanFord' ? 'Quiz mode is not supported for Bellman-Ford because edge relaxation order is arbitrary' : ''}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Quiz
            </button>
            : <button className="btn btn-sm btn-ghost" onClick={exitQuiz} style={{ marginLeft: '8px', color: 'var(--neon-yellow)', borderColor: 'rgba(251,191,36,0.3)' }}>
              Exit Quiz
            </button>
          }
          {!quizMode && (
            <>
              <div className="ctrl-group" style={{ marginLeft: '12px' }}>
                <label>Speed <span className="mono">{speed}%</span></label>
                <input type="range" min={1} max={100} value={speed}
                  onChange={e => setSpeed(+e.target.value)} />
              </div>
              <span className="ctrl-sep" />
              <div className="playback-btns">
                {!playing
                  ? <button className="btn btn-primary btn-icon" onClick={play} disabled={done} title="Play">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
                  </button>
                  : <button className="btn btn-ghost btn-icon" onClick={() => { clearInterval(timerRef.current); setPlaying(false); }} title="Pause">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  </button>
                }
                <button className="btn btn-ghost btn-icon" onClick={stepBack} disabled={playing || frameIdx <= 0} title="Step back">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15,18 9,12 15,6" /><line x1="9" y1="18" x2="9" y2="6" />
                  </svg>
                </button>
                <button className="btn btn-ghost btn-icon" onClick={step} disabled={playing || done} title="Step forward">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6" /><line x1="15" y1="18" x2="15" y2="6" />
                  </svg>
                </button>
                <button className="btn btn-ghost btn-icon" onClick={reset} title="Reset">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                  </svg>
                </button>
              </div>
              <span className="ctrl-sep" />
              <button
                className={`btn btn-ghost btn-sm code-toggle ${showCode ? 'active' : ''}`}
                onClick={() => setShowCode(v => !v)}
              >
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
              <button
                className={`btn btn-ghost btn-sm code-toggle ${showDesc ? 'active' : ''}`}
                onClick={() => setShowDesc(v => !v)}
              >
                {showDesc ? 'Hide Info' : 'Show Info'}
              </button>
            </>
          )}
          {quizMode && (
            <>
              <button className="btn btn-sm btn-ghost" onClick={resetGraph}
                style={{ marginLeft: '8px' }} title="Generate a new random graph">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                </svg>
                New Graph
              </button>
              <div className="quiz-progress-wrap">
                <span className="quiz-progress-label mono">{quizClicks.length} / {quizAnswer.length}</span>
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${quizAnswer.length ? (quizClicks.length / quizAnswer.length) * 100 : 0}%` }} />
                </div>
                <span className="quiz-mistakes-badge" title="Mistakes">
                  {quizMistakes > 0 ? `${quizMistakes} mistake${quizMistakes > 1 ? 's' : ''}` : 'No mistakes'}
                </span>
              </div>
            </>
          )}
        </div>
        {quizMode
          ? <p className="graph-desc">Click the edges in the correct <strong>{info.fullLabel}</strong> order{algo !== 'kruskal' && <> starting from <strong>{START_NODE}</strong></>}.</p>
          : <p className="graph-desc">{info.desc}</p>
        }
      </div>

      {showDesc && !quizMode && (
        <div className="card fade-in-up" style={{ marginBottom: '20px', background: 'var(--bg-secondary)', borderLeft: `4px solid var(--neon-${info.badge.split('-')[1] || 'blue'})`, padding: '16px 20px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{info.fullLabel}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
            {info.explanation}
          </p>
        </div>
      )}

      <div className="graph-main">
        <div className={`graph-canvas card ${quizMode ? 'quiz-active' : ''}`}>
          {toast && (
            <div className="quiz-toast">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {toast}
            </div>
          )}
          {quizDone && createPortal(
            <div className="quiz-banner">
              <div className="quiz-banner-icon">{quizMistakes === 0 ? '✓' : '✓'}</div>
              <h3>{quizMistakes === 0 ? 'Perfect!' : 'Completed!'}</h3>
              <p>Finished in <strong>{quizTime}s</strong> with <strong style={{ color: quizMistakes === 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}>{quizMistakes} mistake{quizMistakes !== 1 ? 's' : ''}</strong>.</p>
              <div className="quiz-banner-order">
                {quizAnswer.map((id, i) => (
                  <span key={id} className="quiz-order-chip">{i + 1}. {id}</span>
                ))}
              </div>
              <div className="quiz-done fade-in-up">
                <h3>Quiz Complete!</h3>
                <p>You finished in <strong>{quizTime}s</strong> with <strong>{quizMistakes}</strong> mistakes.</p>
                <button className="btn btn-ghost" onClick={resetGraph}>New Graph</button>
              </div>
            </div>,
            document.body
          )}
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%" style={{ cursor: quizMode && !quizDone ? 'pointer' : 'default' }}>
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="28" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="var(--border)" />
              </marker>
              <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="28" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="var(--neon-blue)" />
              </marker>
            </defs>
            {graphEdges.map(([u, v, w]) => {
              const pu = NODE_MAP[u], pv = NODE_MAP[v];
              let active = false;
              const edgeKey = [u, v].sort().join('-');
              
              if (quizMode) {
                active = quizClicks.includes(edgeKey);
              } else {
                active = isEdgeActive(u, v);
              }
              
              const isEdgeClickable = quizMode && !quizDone && !quizClicks.includes(edgeKey);
              
              return (
                <g key={edgeKey}>
                  {isEdgeClickable && (
                    <line x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y} stroke="transparent" strokeWidth="20"
                          style={{ cursor: 'pointer' }} onClick={() => handleQuizClick(edgeKey)} />
                  )}
                  <line
                    x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y}
                    className={`graph-edge ${active ? 'active' : ''} ${algo === 'kruskal' || algo === 'prim' ? 'mst' : ''} ${edgeKey === wrongNode ? 'wrong-edge' : ''}`}
                    style={isEdgeClickable ? { pointerEvents: 'none' } : undefined}
                    markerEnd={isDirected ? (active ? "url(#arrow-active)" : "url(#arrow)") : undefined}
                  />
                  {(algo === 'dijkstra' || algo === 'bellmanFord' || algo === 'prim' || algo === 'kruskal') && (
                    <text
                      x={(pu.x + pv.x) / 2}
                      y={(pu.y + pv.y) / 2 - 8}
                      className="edge-weight"
                      textAnchor="middle"
                    >
                      {w ?? 1}
                    </text>
                  )}
                </g>
              );
            })}
            {graphNodes.map(node => {
              const state = quizMode ? getQuizNodeState(node.id) : getNodeState(node.id);
              const nodeClickable = quizMode && !quizDone;
              return (
                <g
                  key={node.id}
                  className={`graph-node ${state}`}
                  transform={`translate(${node.x},${node.y})`}
                  onClick={nodeClickable ? handleNodeClickWarning : undefined}
                  style={nodeClickable ? { cursor: 'not-allowed' } : {}}
                >
                  <circle r={R} />
                  <text dy="0.35em" textAnchor="middle">{node.id}</text>
                  {quizMode && quizClicks.includes(node.id) && (
                    <text dy="0.35em" dx={R + 6} textAnchor="start" fontSize="11" fill="var(--neon-green)" fontWeight="700">
                      {quizClicks.indexOf(node.id) + 1}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {!quizMode && (
          <div className="graph-side">
            {(algo === 'dijkstra' || algo === 'prim') ? (
              <div className="card graph-panel dist-panel">
                <h3>{algo === 'prim' ? 'Edge Key' : 'Distances'}</h3>
                <div className="dist-table">
                  <div className="dist-row dist-header">
                    <span>Node</span>
                    <span>Value</span>
                  </div>
                  {graphNodes.map(n => {
                    const d = distances ? distances[n.id] : Infinity;
                    const dStr = d === Infinity ? '∞' : d;
                    return (
                      <div key={n.id} className={`dist-row ${n.id === current ? 'current' : ''}`}>
                        <span>{n.id}</span>
                        <span className="mono">{dStr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card graph-panel">
                <h3>{structLabel}</h3>
                <div className="struct-list">
                  {[...frontier].length === 0
                    ? <span className="empty-log">Empty</span>
                    : [...frontier].map((id, i) => (
                      <div key={i} className="struct-item">
                        <span className="struct-idx">{i}</span>
                        <span className="struct-val">{id}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            <div className="card graph-panel">
              <h3>Visited Order</h3>
              <div className="struct-list">
                {path.length === 0
                  ? <span className="empty-log">None yet</span>
                  : path.map((id, i) => (
                    <div key={i} className={`struct-item ${id === current ? 'current' : ''}`}>
                      <span className="struct-idx">{i + 1}</span>
                      <span className="struct-val">{id}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="card graph-legend">
              <h3>Legend</h3>
              <div className="legend-items">
                <div className="legend-item"><span className="gleg default" />Unvisited</div>
                <div className="legend-item"><span className="gleg frontier" />In {algo === 'dijkstra' || algo === 'prim' ? 'Frontier' : structLabel}</div>
                <div className="legend-item"><span className="gleg current" />Current</div>
                <div className="legend-item"><span className="gleg visited" />{algo === 'prim' || algo === 'kruskal' ? 'In MST' : 'Visited'}</div>
              </div>
            </div>
          </div>
        )}
        {quizMode && (
          <div className="graph-side">
            <div className="card graph-panel">
              <h3>Your Order</h3>
              <div className="struct-list">
                {quizClicks.length === 0
                  ? <span className="empty-log">Click an edge</span>
                  : quizClicks.map((id, i) => (
                    <div key={i} className="struct-item correct">
                      <span className="struct-idx">{i + 1}</span>
                      <span className="struct-val">{id}</span>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="card graph-legend">
              <h3>Legend</h3>
              <div className="legend-items">
                <div className="legend-item"><span className="gleg default" />Not clicked</div>
                <div className="legend-item"><span className="gleg" style={{ background: 'rgba(52,211,153,0.2)', borderColor: 'var(--neon-green)' }} />Correct</div>
                <div className="legend-item"><span className="gleg" style={{ background: 'rgba(248,113,113,0.2)', borderColor: 'var(--neon-red)' }} />Wrong (try again)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCode && (
        <div className="graph-code-panel card">
          <div className="code-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="code-panel-title">{info.fullLabel}</span>
              <span className={`badge ${info.badge}`}>{info.label}</span>
            </div>
            <div className="code-lang-tabs">
              {['javascript', 'python', 'java', 'cpp'].map(l => (
                <button key={l} className={`lang-tab ${codeLang === l ? 'active' : ''}`} onClick={() => setCodeLang(l)}>
                  {l === 'javascript' ? 'JS' : l === 'python' ? 'Python' : l === 'java' ? 'Java' : 'C++'}
                </button>
              ))}
            </div>
          </div>
          <pre
            className="code-block"
            dangerouslySetInnerHTML={{ __html: highlight(CODE_SNIPPETS[algo][codeLang] || CODE_SNIPPETS[algo].javascript) }}
          />
        </div>
      )}
    </div>
  );
}
