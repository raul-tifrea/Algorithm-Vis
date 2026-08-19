import { useState, useCallback, useRef, useEffect } from 'react';
import { bfsTraversal } from '../algorithms/graphs/bfs';
import { dfsTraversal } from '../algorithms/graphs/dfs';
import { dijkstraTraversal } from '../algorithms/graphs/dijkstra';
import './GraphVisualizer.css';

const DEFAULT_NODES = [
  { id: 'A', x: 350, y: 60 },
  { id: 'B', x: 180, y: 160 },
  { id: 'C', x: 520, y: 160 },
  { id: 'D', x: 80,  y: 290 },
  { id: 'E', x: 280, y: 290 },
  { id: 'F', x: 430, y: 290 },
  { id: 'G', x: 620, y: 290 },
  { id: 'H', x: 180, y: 400 },
  { id: 'I', x: 490, y: 400 },
];

const DEFAULT_EDGES = [
  ['A','B',4], ['A','C',2],
  ['B','D',5], ['B','E',1],
  ['C','F',8], ['C','G',10],
  ['D','H',2], ['E','H',6],
  ['F','I',3], ['G','I',7],
  ['E','F',4],
];

function buildGraph(nodes, edges) {
  const adj = {};
  const adjWeighted = {};
  for (const n of nodes) { adj[n.id] = []; adjWeighted[n.id] = []; }
  for (const [u, v, w] of edges) {
    const weight = w ?? 1;
    adj[u].push(v); adj[v].push(u);
    adjWeighted[u].push({ node: v, weight }); adjWeighted[v].push({ node: u, weight });
  }
  const map = Object.fromEntries(nodes.map(n => [n.id, n]));
  return { adj, adjWeighted, map };
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateRandomGraph() {
  const count = 7 + Math.floor(Math.random() * 5);
  const ids = LETTERS.slice(0, count).split('');
  const SVG_W = 700, SVG_H = 480;
  const pad = 70;
  const MIN_DIST = 100;
  const nodes = [];

  let attempts = 0;
  while (nodes.length < ids.length && attempts < 5000) {
    attempts++;
    const x = pad + Math.random() * (SVG_W - pad * 2);
    const y = pad + Math.random() * (SVG_H - pad * 2);
    const tooClose = nodes.some(n => Math.hypot(n.x - x, n.y - y) < MIN_DIST);
    if (!tooClose) {
      nodes.push({ id: ids[nodes.length], x: Math.round(x), y: Math.round(y) });
    }
  }

  if (nodes.length < ids.length) {
    const fallbackIds = LETTERS.slice(0, nodes.length).split('');
    nodes.forEach((n, i) => { n.id = fallbackIds[i]; });
  }

  const nodeIds = nodes.map(n => n.id);
  const edges = [];
  const edgeSet = new Set();
  const addEdge = (u, v) => {
    const key = [u, v].sort().join('-');
    const weight = 1 + Math.floor(Math.random() * 9);
    if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([u, v, weight]); }
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
  bfs: `function bfs(startNode) {
  let queue = [startNode];
  let visited = new Set([startNode]);

  while (queue.length > 0) {
    let node = queue.shift(); // Get FIRST item
    console.log(node);

    for (let neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // Add to END
      }
    }
  }
}`,

  dfs: `function dfs(startNode) {
  let stack = [startNode];
  let visited = new Set([startNode]);

  while (stack.length > 0) {
    let node = stack.pop(); // Get LAST item
    console.log(node);

    for (let neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor); // Add to TOP
      }
    }
  }
}`,

  dijkstra: `function dijkstra(graph, start) {
  let distances = {}; // Shortest distance to each node
  let visited = new Set();
  let frontier = { [start]: 0 };

  for (let node in graph) {
    distances[node] = Infinity; // Unknown at start
  }
  distances[start] = 0;

  while (Object.keys(frontier).length > 0) {
    // Pick the unvisited node with smallest distance
    let current = Object.keys(frontier)
      .reduce((a, b) => frontier[a] < frontier[b] ? a : b);

    delete frontier[current];
    visited.add(current);

    for (let { node, weight } of graph[current]) {
      if (visited.has(node)) continue;

      let newDist = distances[current] + weight;
      if (newDist < distances[node]) {
        distances[node] = newDist; // Found a shorter path!
        frontier[node] = newDist;
      }
    }
  }
  return distances;
}`,
};

const ALGORITHMS = {
  bfs:      { fn: bfsTraversal,      label: 'BFS',      fullLabel: 'Breadth-First Search',    desc: 'Explores level by level using a queue',         badge: 'badge-blue'   },
  dfs:      { fn: dfsTraversal,      label: 'DFS',      fullLabel: 'Depth-First Search',        desc: 'Explores as deep as possible using a stack',     badge: 'badge-purple' },
  dijkstra: { fn: dijkstraTraversal, label: 'Dijkstra', fullLabel: "Dijkstra's Shortest Path", desc: 'Finds shortest paths from a source using weights', badge: 'badge-yellow'  },
};

const START_NODE = 'A';
const SVG_W = 700;
const SVG_H = 480;
const R = 24;

function highlight(code) {
  const keywords = /\b(function|return|const|let|if|else|while|for|of|new|continue|true|false)\b/g;
  const comments = /(\/\/[^\n]*)/g;
  const numbers = /\b(\d+)\b/g;
  const strings = /('[^']*'|"[^"]*")/g;
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(strings, '<span class="tok-str">$1</span>')
    .replace(comments, '<span class="tok-comment">$1</span>')
    .replace(keywords, '<span class="tok-kw">$1</span>')
    .replace(numbers, '<span class="tok-num">$1</span>');
}

export default function GraphVisualizer() {
  const [algo, setAlgo] = useState('bfs');
  const [speed, setSpeed] = useState(50);
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const timerRef = useRef(null);

  const [graphNodes, setGraphNodes] = useState(DEFAULT_NODES);
  const [graphEdges, setGraphEdges] = useState(DEFAULT_EDGES);

  const { adj: ADJACENCY, adjWeighted: ADJACENCY_W, map: NODE_MAP } = buildGraph(graphNodes, graphEdges);
  const START_NODE = graphNodes[0]?.id ?? 'A';

  function getGraphForAlgo(algoKey, adj, adjW) {
    return algoKey === 'dijkstra' ? adjW : adj;
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
  const frontier = algo === 'dijkstra' ? new Set(Object.keys(dijkFrontier)) : bfsDfsFrontier;
  const path = currentFrame?.path ?? [];

  function computeAnswer(algoKey, adj, adjW, startId) {
    const graphArg = getGraphForAlgo(algoKey, adj, adjW);
    const fs = ALGORITHMS[algoKey].fn(graphArg, startId);
    const order = [];
    let prev = null;
    for (const f of fs) {
      if (f.current && !order.includes(f.current)) order.push(f.current);
      if (f.previous) prev = f.previous;
    }
    return { order, previous: prev };
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

  const newRandomGraph = useCallback(() => {
    const { nodes, edges } = generateRandomGraph();
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
      const { adj, adjWeighted } = buildGraph(nodes, edges);
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

  const handleQuizClick = useCallback((nodeId) => {
    if (quizDone) return;
    const nextExpected = quizAnswer[quizClicks.length];
    if (nodeId === nextExpected) {
      const newClicks = [...quizClicks, nodeId];
      setQuizClicks(newClicks);
      if (newClicks.length === quizAnswer.length) {
        setQuizDone(true);
        setQuizTime(Math.round((Date.now() - quizStartRef.current) / 1000));
      }
    } else {
      setQuizMistakes(m => m + 1);
      setWrongNode(nodeId);
      setTimeout(() => setWrongNode(null), 600);
      showToast(`Wrong! The correct next node was "${nextExpected}" — it has been placed automatically.`);
      const newClicks = [...quizClicks, nextExpected];
      setTimeout(() => {
        setQuizClicks(newClicks);
        if (newClicks.length === quizAnswer.length) {
          setQuizDone(true);
          setQuizTime(Math.round((Date.now() - quizStartRef.current) / 1000));
        }
      }, 650);
    }
  }, [quizAnswer, quizClicks, quizDone]);

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
    if (algo === 'dijkstra' && previous) {
      return previous[u] === v || previous[v] === u;
    }
    return visited.has(u) && visited.has(v);
  };

  const info = ALGORITHMS[algo];
  const structLabel = algo === 'bfs' ? 'Queue' : 'Stack';

  const getQuizNodeState = (id) => {
    if (id === wrongNode) return 'wrong';
    if (quizClicks.includes(id)) return 'correct';
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
            ? <button className="btn btn-sm btn-ghost quiz-btn" onClick={startQuiz} disabled={playing} style={{ marginLeft: '8px' }}>
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
              <button
                className={`btn btn-ghost btn-sm code-toggle ${showCode ? 'active' : ''}`}
                onClick={() => setShowCode(v => !v)}
              >
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
            </>
          )}
          {quizMode && (
            <>
              <button className="btn btn-sm btn-ghost" onClick={newRandomGraph}
                style={{ marginLeft: '8px' }} title="Generate new random graph">
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
          ? <p className="graph-desc">Click the nodes in the correct <strong>{info.fullLabel}</strong> order starting from <strong>{START_NODE}</strong>.</p>
          : <p className="graph-desc">{info.desc}</p>
        }
      </div>

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
          {quizDone && (
            <div className="quiz-banner">
              <div className="quiz-banner-icon">{quizMistakes === 0 ? '✓' : '✓'}</div>
              <h3>{quizMistakes === 0 ? 'Perfect!' : 'Completed!'}</h3>
              <p>Finished in <strong>{quizTime}s</strong> with <strong style={{ color: quizMistakes === 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}>{quizMistakes} mistake{quizMistakes !== 1 ? 's' : ''}</strong>.</p>
              <div className="quiz-banner-order">
                {quizAnswer.map((id, i) => (
                  <span key={id} className="quiz-order-chip">{i + 1}. {id}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={startQuiz}>Try Again</button>
                <button className="btn btn-ghost" onClick={newRandomGraph}>New Graph</button>
              </div>
            </div>
          )}
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%" style={{ cursor: quizMode && !quizDone ? 'pointer' : 'default' }}>
            {graphEdges.map(([u, v, w]) => {
              const pu = NODE_MAP[u], pv = NODE_MAP[v];
              let active = false;
              if (quizMode) {
                if (algo === 'dijkstra' && quizPrevious) {
                  active = quizClicks.includes(u) && quizClicks.includes(v) && 
                           (quizPrevious[u] === v || quizPrevious[v] === u);
                } else {
                  active = quizClicks.includes(u) && quizClicks.includes(v);
                }
              } else {
                active = isEdgeActive(u, v);
              }
              return (
                <g key={`${u}-${v}`}>
                  <line
                    x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y}
                    className={`graph-edge ${active ? 'active' : ''}`}
                  />
                  {algo === 'dijkstra' && (
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
              const clickable = quizMode && !quizDone && !quizClicks.includes(node.id);
              return (
                <g
                  key={node.id}
                  className={`graph-node ${state}`}
                  transform={`translate(${node.x},${node.y})`}
                  onClick={clickable ? () => handleQuizClick(node.id) : undefined}
                  style={clickable ? { cursor: 'pointer' } : {}}
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
            {algo === 'dijkstra' ? (
              <div className="card graph-panel dist-panel">
                <h3>Distances</h3>
                <div className="dist-table">
                  <div className="dist-row dist-header">
                    <span>Node</span>
                    <span>Distance</span>
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
                <div className="legend-item"><span className="gleg frontier" />In {structLabel}</div>
                <div className="legend-item"><span className="gleg current" />Current</div>
                <div className="legend-item"><span className="gleg visited" />Visited</div>
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
                  ? <span className="empty-log">Click a node</span>
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
