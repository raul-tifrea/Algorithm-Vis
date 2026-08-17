import { useState, useCallback, useRef } from 'react';
import { bfsTraversal } from '../algorithms/graphs/bfs';
import { dfsTraversal } from '../algorithms/graphs/dfs';
import './GraphVisualizer.css';

// ─── Pre-built graph ─────────────────────────────────────────
const NODES = [
  { id: 'A', x: 350, y:  60 },
  { id: 'B', x: 180, y: 160 },
  { id: 'C', x: 520, y: 160 },
  { id: 'D', x:  80, y: 290 },
  { id: 'E', x: 280, y: 290 },
  { id: 'F', x: 430, y: 290 },
  { id: 'G', x: 620, y: 290 },
  { id: 'H', x: 180, y: 400 },
  { id: 'I', x: 490, y: 400 },
];

const EDGES = [
  ['A','B'], ['A','C'],
  ['B','D'], ['B','E'],
  ['C','F'], ['C','G'],
  ['D','H'], ['E','H'],
  ['F','I'], ['G','I'],
  ['E','F'],
];

const ADJACENCY = {};
for (const node of NODES) ADJACENCY[node.id] = [];
for (const [u, v] of EDGES) {
  ADJACENCY[u].push(v);
  ADJACENCY[v].push(u);
}

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));

// ─── Code snippets ────────────────────────────────────────────
const CODE_SNIPPETS = {
  bfs: `function bfs(graph, start) {
  const visited = new Set();
  const queue   = [start];  // Use a queue (FIFO)
  const result  = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();  // Dequeue front
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);    // Enqueue unvisited neighbors
      }
    }
  }
  return result;
}

// Explores level by level — closest nodes first.
// Time:  O(V + E)   Space: O(V)`,

  dfs: `function dfs(graph, start) {
  const visited = new Set();
  const stack   = [start];  // Use a stack (LIFO)
  const result  = [];

  while (stack.length > 0) {
    const node = stack.pop();   // Pop from top

    if (visited.has(node)) continue;
    visited.add(node);
    result.push(node);

    // Push neighbors in reverse to preserve order
    const neighbors = [...graph[node]].reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);   // Push unvisited neighbors
      }
    }
  }
  return result;
}

// Goes as deep as possible before backtracking.
// Time:  O(V + E)   Space: O(V)`,
};

const ALGORITHMS = {
  bfs: { fn: bfsTraversal, label: 'BFS', fullLabel: 'Breadth-First Search', desc: 'Explores level by level using a queue', badge: 'badge-blue' },
  dfs: { fn: dfsTraversal, label: 'DFS', fullLabel: 'Depth-First Search',   desc: 'Explores as deep as possible using a stack', badge: 'badge-purple' },
};

const START_NODE = 'A';
const SVG_W = 700;
const SVG_H = 480;
const R = 24;

// ─── Syntax highlighter ───────────────────────────────────────
function highlight(code) {
  const keywords = /\b(function|return|const|let|if|else|while|for|of|new|continue|true|false)\b/g;
  const comments = /(\/\/[^\n]*)/g;
  const numbers  = /\b(\d+)\b/g;
  const strings  = /('[^']*'|"[^"]*")/g;
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(strings,  '<span class="tok-str">$1</span>')
    .replace(comments, '<span class="tok-comment">$1</span>')
    .replace(keywords, '<span class="tok-kw">$1</span>')
    .replace(numbers,  '<span class="tok-num">$1</span>');
}

export default function GraphVisualizer() {
  const [algo, setAlgo]         = useState('bfs');
  const [frames, setFrames]     = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying]   = useState(false);
  const [done, setDone]         = useState(false);
  const [showCode, setShowCode] = useState(true);
  const timerRef = useRef(null);

  const currentFrame = frames[frameIdx] ?? null;
  const visited  = currentFrame?.visited  ?? new Set();
  const current  = currentFrame?.current  ?? null;
  const frontier = currentFrame?.inQueue ?? currentFrame?.inStack ?? new Set();
  const path     = currentFrame?.path ?? [];

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
  }, []);

  const play = useCallback(() => {
    const f = ALGORITHMS[algo].fn(ADJACENCY, START_NODE);
    setFrames(f);
    let idx = -1;
    setDone(false);
    setPlaying(true);
    timerRef.current = setInterval(() => {
      idx++;
      setFrameIdx(idx);
      if (idx >= f.length - 1) {
        clearInterval(timerRef.current);
        setPlaying(false);
        setDone(true);
      }
    }, 500);
  }, [algo]);

  const step = useCallback(() => {
    let f = frames;
    if (f.length === 0) {
      f = ALGORITHMS[algo].fn(ADJACENCY, START_NODE);
      setFrames(f);
    }
    setFrameIdx(i => {
      const next = Math.min(i + 1, f.length - 1);
      if (next === f.length - 1) setDone(true);
      return next;
    });
  }, [frames, algo]);

  const stepBack = useCallback(() => {
    setFrameIdx(i => {
      const prev = Math.max(0, i - 1);
      if (i === frames.length - 1) setDone(false);
      return prev;
    });
  }, [frames]);

  const getNodeState = (id) => {
    if (id === current)   return 'current';
    if (frontier.has(id)) return 'frontier';
    if (visited.has(id))  return 'visited';
    return 'default';
  };

  const isEdgeActive = (u, v) => visited.has(u) && visited.has(v);

  const info = ALGORITHMS[algo];
  const structLabel = algo === 'bfs' ? 'Queue' : 'Stack';

  return (
    <div className="graph-vis fade-in-up">
      {/* Controls */}
      <div className="graph-controls card">
        <div className="ctrl-row">
          {Object.entries(ALGORITHMS).map(([key, v]) => (
            <button
              key={key}
              className={`btn btn-sm ${algo === key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { setAlgo(key); reset(); }}
              disabled={playing}
            >
              {v.label}
            </button>
          ))}
          <span className="ctrl-sep" />
          {!playing
            ? <button className="btn btn-primary btn-sm" onClick={play} disabled={done}>▶ Play</button>
            : <button className="btn btn-ghost btn-sm" onClick={() => { clearInterval(timerRef.current); setPlaying(false); }}>⏸ Pause</button>
          }
          <button className="btn btn-ghost btn-sm" onClick={stepBack} disabled={playing || frameIdx <= 0}>← Back</button>
          <button className="btn btn-ghost btn-sm" onClick={step} disabled={playing || done}>→ Step</button>
          <button className="btn btn-ghost btn-sm" onClick={reset}>↺ Reset</button>
          <button
            className={`btn btn-ghost btn-sm code-toggle ${showCode ? 'active' : ''}`}
            onClick={() => setShowCode(v => !v)}
          >
            {'</>'} {showCode ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
        <p className="graph-desc">{info.desc}</p>
      </div>

      {/* Graph + side panels */}
      <div className="graph-main">
        {/* SVG */}
        <div className="graph-canvas card">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%">
            {EDGES.map(([u, v]) => {
              const pu = NODE_MAP[u], pv = NODE_MAP[v];
              return (
                <line key={`${u}-${v}`}
                  x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y}
                  className={`graph-edge ${isEdgeActive(u, v) ? 'active' : ''}`}
                />
              );
            })}
            {NODES.map(node => {
              const state = getNodeState(node.id);
              return (
                <g key={node.id} className={`graph-node ${state}`} transform={`translate(${node.x},${node.y})`}>
                  <circle r={R} />
                  <text dy="0.35em" textAnchor="middle">{node.id}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side panels */}
        <div className="graph-side">
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
              <div className="legend-item"><span className="gleg default"/>Unvisited</div>
              <div className="legend-item"><span className="gleg frontier"/>In {structLabel}</div>
              <div className="legend-item"><span className="gleg current"/>Current</div>
              <div className="legend-item"><span className="gleg visited"/>Visited</div>
            </div>
          </div>
        </div>
      </div>

      {/* Code panel */}
      {showCode && (
        <div className="graph-code-panel card">
          <div className="code-panel-header">
            <span className="code-panel-title">{info.fullLabel}</span>
            <span className={`badge ${info.badge}`}>{info.label}</span>
          </div>
          <pre
            className="code-block"
            dangerouslySetInnerHTML={{ __html: highlight(CODE_SNIPPETS[algo]) }}
          />
        </div>
      )}
    </div>
  );
}
