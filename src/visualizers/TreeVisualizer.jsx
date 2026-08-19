import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
} from '../algorithms/trees/traversals';
import './TreeVisualizer.css';

const DEFAULT_TREE_NODES = [
  { id: 'n1', value: 50, left: 'n2', right: 'n3' },
  { id: 'n2', value: 30, left: 'n4', right: 'n5' },
  { id: 'n3', value: 70, left: 'n6', right: 'n7' },
  { id: 'n4', value: 20, left: 'n8', right: 'n9' },
  { id: 'n5', value: 40, left: null, right: null },
  { id: 'n6', value: 60, left: null, right: null },
  { id: 'n7', value: 80, left: 'n10', right: null },
  { id: 'n8', value: 15, left: null, right: null },
  { id: 'n9', value: 25, left: null, right: null },
  { id: 'n10', value: 75, left: null, right: null },
];
const DEFAULT_ROOT_ID = 'n1';

function generateRandomTree() {
  const targetCount = 5 + Math.floor(Math.random() * 8);
  const MAX_DEPTH = 4;
  let idCounter = 1;
  const nodes = [];
  const queue = [];
  const depthMap = {};

  const rootId = `n${idCounter++}`;
  nodes.push({ id: rootId, value: 10 + Math.floor(Math.random() * 90), left: null, right: null });
  queue.push(rootId);
  depthMap[rootId] = 1;

  while (nodes.length < targetCount && queue.length > 0) {
    const parentId = queue.shift();
    const parent = nodes.find(n => n.id === parentId);
    const parentDepth = depthMap[parentId];

    if (parentDepth >= MAX_DEPTH) continue;

    const isRoot = parentId === rootId;

    for (const side of ['left', 'right']) {
      if (nodes.length >= targetCount) break;
      if (isRoot || Math.random() > 0.25) {
        const childId = `n${idCounter++}`;
        nodes.push({ id: childId, value: 10 + Math.floor(Math.random() * 90), left: null, right: null });
        parent[side] = childId;
        queue.push(childId);
        depthMap[childId] = parentDepth + 1;
      }
    }
  }

  if (nodes.length < 5) return generateRandomTree();
  return { nodes, rootId };
}

const CODE_SNIPPETS = {
  inorder: `function inorder(node) {
  if (!node) return;

  inorder(node.left);   // 1. Left
  console.log(node);    // 2. Root
  inorder(node.right);  // 3. Right
}`,

  preorder: `function preorder(node) {
  if (!node) return;

  console.log(node);    // 1. Root
  preorder(node.left);  // 2. Left
  preorder(node.right); // 3. Right
}`,

  postorder: `function postorder(node) {
  if (!node) return;

  postorder(node.left);   // 1. Left
  postorder(node.right);  // 2. Right
  console.log(node);      // 3. Root
}`,
};

const TRAVERSALS = {
  inorder:   { fn: inorderTraversal,   label: 'In-order',   desc: 'Left → Root → Right', badge: 'badge-blue'   },
  preorder:  { fn: preorderTraversal,  label: 'Pre-order',  desc: 'Root → Left → Right', badge: 'badge-purple' },
  postorder: { fn: postorderTraversal, label: 'Post-order', desc: 'Left → Right → Root', badge: 'badge-yellow' },
};

const SVG_W = 700;
const SVG_H = 360;
const R = 22;

function calcPositions(id, depth, xMin, xMax, positions, nodeMap) {
  if (!id || !nodeMap[id]) return;
  const x = (xMin + xMax) / 2;
  const y = 40 + depth * 80;
  positions[id] = { x, y };
  const node = nodeMap[id];
  calcPositions(node.left,  depth + 1, xMin,           (xMin + xMax) / 2, positions, nodeMap);
  calcPositions(node.right, depth + 1, (xMin + xMax) / 2, xMax,           positions, nodeMap);
}

function buildNodeMap(nodes) {
  return Object.fromEntries(nodes.map(n => [n.id, n]));
}

function computeTraversalAnswer(traversalKey, nodes, rootId) {
  const frames = TRAVERSALS[traversalKey].fn(nodes, rootId);
  const order = [];
  for (const f of frames) {
    if (f.highlighted && !order.includes(f.highlighted)) order.push(f.highlighted);
  }
  return order;
}

function highlight(code) {
  const keywords = /\b(function|return|const|let|if|else|while|for|of|null)\b/g;
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

export default function TreeVisualizer() {
  const [traversal, setTraversal] = useState('inorder');
  const [speed, setSpeed] = useState(50);
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const timerRef = useRef(null);

  const [treeNodes, setTreeNodes] = useState(DEFAULT_TREE_NODES);
  const [rootId, setRootId] = useState(DEFAULT_ROOT_ID);

  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState([]);
  const [quizClicks, setQuizClicks] = useState([]);
  const [wrongNode, setWrongNode] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizTime, setQuizTime] = useState(0);
  const [quizMistakes, setQuizMistakes] = useState(0);
  const [toast, setToast] = useState(null);
  const quizStartRef = useRef(null);
  const toastTimer = useRef(null);

  const nodeMap = buildNodeMap(treeNodes);
  const positions = {};
  calcPositions(rootId, 0, 0, SVG_W, positions, nodeMap);

  const currentFrame = frames[frameIdx] ?? null;
  const highlighted = currentFrame?.highlighted ?? null;
  const order = currentFrame?.order ?? [];

  function showToast(msg) {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
  }, []);

  const startQuiz = useCallback((nodes, rid, tkey) => {
    const n = nodes ?? treeNodes;
    const r = rid   ?? rootId;
    const t = tkey  ?? traversal;
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
    setQuizAnswer(computeTraversalAnswer(t, n, r));
    setQuizMode(true);
    quizStartRef.current = Date.now();
  }, [treeNodes, rootId, traversal]);

  const newRandomTree = useCallback(() => {
    const { nodes, rootId: newRoot } = generateRandomTree();
    setTreeNodes(nodes);
    setRootId(newRoot);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
    if (quizMode) {
      startQuiz(nodes, newRoot, traversal);
    }
  }, [quizMode, traversal, startQuiz]);

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
      showToast(`Wrong! The correct next node was "${nodeMap[nextExpected]?.value}" — it has been placed automatically.`);
      const newClicks = [...quizClicks, nextExpected];
      setTimeout(() => {
        setQuizClicks(newClicks);
        if (newClicks.length === quizAnswer.length) {
          setQuizDone(true);
          setQuizTime(Math.round((Date.now() - quizStartRef.current) / 1000));
        }
      }, 650);
    }
  }, [quizAnswer, quizClicks, quizDone, nodeMap]);

  const play = useCallback(() => {
    if (frames.length === 0 || done) {
      const f = TRAVERSALS[traversal].fn(treeNodes, rootId);
      setFrames(f);
      setFrameIdx(-1);
      setDone(false);
    }
    setPlaying(true);
  }, [frames.length, done, traversal, treeNodes, rootId]);

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
      f = TRAVERSALS[traversal].fn(treeNodes, rootId);
      setFrames(f);
    }
    setFrameIdx(i => {
      const next = Math.min(i + 1, f.length - 1);
      if (next === f.length - 1) setDone(true);
      return next;
    });
  }, [frames, traversal, treeNodes, rootId]);

  const stepBack = useCallback(() => {
    setFrameIdx(i => {
      const prev = Math.max(0, i - 1);
      if (i === frames.length - 1) setDone(false);
      return prev;
    });
  }, [frames]);

  const getQuizNodeState = (id) => {
    if (id === wrongNode) return 'wrong';
    if (quizClicks.includes(id)) return 'correct';
    return '';
  };

  const getNodeClass = (id) => {
    if (quizMode) {
      const qs = getQuizNodeState(id);
      return `tree-node${qs ? ' ' + qs : ''}`;
    }
    if (id === highlighted) return 'tree-node active';
    if (order.includes(id)) return 'tree-node visited';
    return 'tree-node';
  };

  const info = TRAVERSALS[traversal];

  return (
    <div className="tree-vis fade-in-up">
      <div className="tree-controls card">
        <div className="ctrl-row">
          {Object.entries(TRAVERSALS).map(([key, v]) => (
            <button
              key={key}
              className={`btn btn-sm ${traversal === key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { setTraversal(key); reset(); exitQuiz(); }}
              disabled={playing}
            >
              {v.label}
            </button>
          ))}
          {!quizMode
            ? <button className="btn btn-sm btn-ghost" onClick={() => startQuiz()} disabled={playing} style={{ marginLeft: '8px' }}>
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
              <button className="btn btn-sm btn-ghost" onClick={newRandomTree}
                style={{ marginLeft: '8px' }} title="Generate a new random tree">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                </svg>
                New Tree
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
          ? <p className="desc-text" style={{ marginTop: '6px' }}>Click the nodes in the correct <strong>{info.label}</strong> order (<span className="mono">{info.desc}</span>).</p>
          : <div className="traversal-desc">
              <span className={`badge ${info.badge}`}>{info.label}</span>
              <span className="desc-text">{info.desc}</span>
            </div>
        }
      </div>

      <div className="tree-main">
        <div className={`tree-canvas card ${quizMode ? 'quiz-active' : ''}`} style={{ position: 'relative' }}>
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
              <div className="quiz-banner-icon">✓</div>
              <h3>{quizMistakes === 0 ? 'Perfect!' : 'Completed!'}</h3>
              <p>Finished in <strong>{quizTime}s</strong> with <strong style={{ color: quizMistakes === 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}>{quizMistakes} mistake{quizMistakes !== 1 ? 's' : ''}</strong>.</p>
              <div className="quiz-banner-order">
                {quizAnswer.map((id, i) => (
                  <span key={id} className="quiz-order-chip">{i + 1}. {nodeMap[id]?.value}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={() => startQuiz()}>Try Again</button>
                <button className="btn btn-ghost" onClick={newRandomTree}>New Tree</button>
              </div>
            </div>,
            document.body
          )}
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%"
            style={{ cursor: quizMode && !quizDone ? 'pointer' : 'default' }}>
            {treeNodes.map(node => {
              const pos = positions[node.id];
              if (!pos) return null;
              const quizEdgeLeft  = quizMode && quizClicks.includes(node.id) && node.left  && quizClicks.includes(node.left);
              const quizEdgeRight = quizMode && quizClicks.includes(node.id) && node.right && quizClicks.includes(node.right);
              return (
                <g key={`edges-${node.id}`}>
                  {node.left && positions[node.left] && (
                    <line
                      x1={pos.x} y1={pos.y}
                      x2={positions[node.left].x} y2={positions[node.left].y}
                      className={`tree-edge ${quizMode ? (quizEdgeLeft ? 'visited' : '') : (order.includes(node.left) ? 'visited' : '')}`}
                    />
                  )}
                  {node.right && positions[node.right] && (
                    <line
                      x1={pos.x} y1={pos.y}
                      x2={positions[node.right].x} y2={positions[node.right].y}
                      className={`tree-edge ${quizMode ? (quizEdgeRight ? 'visited' : '') : (order.includes(node.right) ? 'visited' : '')}`}
                    />
                  )}
                </g>
              );
            })}
            {treeNodes.map(node => {
              const pos = positions[node.id];
              if (!pos) return null;
              const cls = getNodeClass(node.id);
              const clickable = quizMode && !quizDone && !quizClicks.includes(node.id);
              const stepNum = quizClicks.indexOf(node.id);
              return (
                <g
                  key={node.id}
                  className={cls}
                  transform={`translate(${pos.x},${pos.y})`}
                  onClick={clickable ? () => handleQuizClick(node.id) : undefined}
                  style={clickable ? { cursor: 'pointer' } : {}}
                >
                  <circle r={R} />
                  <text dy="0.35em" textAnchor="middle">{node.value}</text>
                  {quizMode && stepNum >= 0 && (
                    <text dy="0.35em" dx={R + 6} textAnchor="start" fontSize="11" fill="var(--neon-green)" fontWeight="700">
                      {stepNum + 1}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {!quizMode && (
          <div className="tree-log card">
            <h3>Traversal Order</h3>
            <div className="order-list">
              {order.length === 0
                ? <span className="empty-log">No nodes visited yet</span>
                : order.map((id, i) => (
                  <div key={i} className={`order-item ${id === highlighted ? 'current' : ''}`}>
                    <span className="order-num">{i + 1}</span>
                    <span className="order-val">{nodeMap[id]?.value}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        {quizMode && (
          <div className="tree-log card">
            <h3>Your Order</h3>
            <div className="order-list">
              {quizClicks.length === 0
                ? <span className="empty-log">Click a node</span>
                : quizClicks.map((id, i) => (
                  <div key={i} className="order-item correct">
                    <span className="order-num">{i + 1}</span>
                    <span className="order-val" style={{ color: 'var(--neon-green)' }}>{nodeMap[id]?.value}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {showCode && (
        <div className="tree-code-panel card">
          <div className="code-panel-header">
            <span className="code-panel-title">{info.label} Traversal</span>
            <span className={`badge ${info.badge}`}>{info.desc}</span>
          </div>
          <pre
            className="code-block"
            dangerouslySetInnerHTML={{ __html: highlight(CODE_SNIPPETS[traversal]) }}
          />
        </div>
      )}
    </div>
  );
}
