import { useState, useCallback, useRef } from 'react';
import {
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
} from '../algorithms/trees/traversals';
import './TreeVisualizer.css';

const TREE_NODES = [
  { id: 'n1',  value: 50,  left: 'n2',  right: 'n3'  },
  { id: 'n2',  value: 30,  left: 'n4',  right: 'n5'  },
  { id: 'n3',  value: 70,  left: 'n6',  right: 'n7'  },
  { id: 'n4',  value: 20,  left: 'n8',  right: 'n9'  },
  { id: 'n5',  value: 40,  left: null,  right: null  },
  { id: 'n6',  value: 60,  left: null,  right: null  },
  { id: 'n7',  value: 80,  left: 'n10', right: null  },
  { id: 'n8',  value: 15,  left: null,  right: null  },
  { id: 'n9',  value: 25,  left: null,  right: null  },
  { id: 'n10', value: 75,  left: null,  right: null  },
];
const ROOT_ID = 'n1';

const CODE_SNIPPETS = {
  inorder: `function inorder(node) {
  if (node === null) return;

  inorder(node.left);   // 1. Traverse left subtree

  visit(node);          // 2. Visit root

  inorder(node.right);  // 3. Traverse right subtree
}

// Result for this tree:
// 15 → 20 → 25 → 30 → 40 → 50
//   → 60 → 70 → 75 → 80
// Produces sorted output for a BST!`,

  preorder: `function preorder(node) {
  if (node === null) return;

  visit(node);           // 1. Visit root first

  preorder(node.left);   // 2. Traverse left subtree

  preorder(node.right);  // 3. Traverse right subtree
}

// Result for this tree:
// 50 → 30 → 20 → 15 → 25
//   → 40 → 70 → 60 → 80 → 75
// Useful for copying or serializing a tree.`,

  postorder: `function postorder(node) {
  if (node === null) return;

  postorder(node.left);   // 1. Traverse left subtree

  postorder(node.right);  // 2. Traverse right subtree

  visit(node);            // 3. Visit root last
}

// Result for this tree:
// 15 → 25 → 20 → 40 → 30
//   → 60 → 75 → 80 → 70 → 50
// Useful for deleting a tree (children first).`,
};

const TRAVERSALS = {
  inorder:   { fn: inorderTraversal,   label: 'In-order',   desc: 'Left → Root → Right', badge: 'badge-blue'   },
  preorder:  { fn: preorderTraversal,  label: 'Pre-order',  desc: 'Root → Left → Right', badge: 'badge-purple' },
  postorder: { fn: postorderTraversal, label: 'Post-order', desc: 'Left → Right → Root', badge: 'badge-yellow' },
};

const NODE_MAP = Object.fromEntries(TREE_NODES.map(n => [n.id, n]));
const SVG_W = 700;
const SVG_H = 360;
const R = 22;

function calcPositions(id, depth, xMin, xMax, positions) {
  if (!id || !NODE_MAP[id]) return;
  const x = (xMin + xMax) / 2;
  const y = 40 + depth * 80;
  positions[id] = { x, y };
  const node = NODE_MAP[id];
  calcPositions(node.left,  depth + 1, xMin, (xMin + xMax) / 2, positions);
  calcPositions(node.right, depth + 1, (xMin + xMax) / 2, xMax, positions);
}

const POSITIONS = {};
calcPositions(ROOT_ID, 0, 0, SVG_W, POSITIONS);

function highlight(code) {
  const keywords = /\b(function|return|const|let|if|else|while|for|of|null)\b/g;
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

export default function TreeVisualizer() {
  const [traversal, setTraversal] = useState('inorder');
  const [frames, setFrames]       = useState([]);
  const [frameIdx, setFrameIdx]   = useState(-1);
  const [playing, setPlaying]     = useState(false);
  const [done, setDone]           = useState(false);
  const [showCode, setShowCode]   = useState(true);
  const timerRef = useRef(null);

  const currentFrame = frames[frameIdx] ?? null;
  const highlighted  = currentFrame?.highlighted ?? null;
  const order        = currentFrame?.order ?? [];

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
  }, []);

  const play = useCallback(() => {
    const f = TRAVERSALS[traversal].fn(TREE_NODES, ROOT_ID);
    setFrames(f);
    let idx = -1;
    setPlaying(true);
    setDone(false);
    timerRef.current = setInterval(() => {
      idx++;
      setFrameIdx(idx);
      if (idx >= f.length - 1) {
        clearInterval(timerRef.current);
        setPlaying(false);
        setDone(true);
      }
    }, 600);
  }, [traversal]);

  const step = useCallback(() => {
    let f = frames;
    if (f.length === 0) {
      f = TRAVERSALS[traversal].fn(TREE_NODES, ROOT_ID);
      setFrames(f);
    }
    setFrameIdx(i => {
      const next = Math.min(i + 1, f.length - 1);
      if (next === f.length - 1) setDone(true);
      return next;
    });
  }, [frames, traversal]);

  const stepBack = useCallback(() => {
    setFrameIdx(i => {
      const prev = Math.max(0, i - 1);
      if (i === frames.length - 1) setDone(false);
      return prev;
    });
  }, [frames]);

  const getNodeClass = (id) => {
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
              onClick={() => { setTraversal(key); reset(); }}
              disabled={playing}
            >
              {v.label}
            </button>
          ))}
          <span className="ctrl-sep" />
          <div className="playback-btns">
            {!playing
              ? <button className="btn btn-primary btn-icon" onClick={play} disabled={done} title="Play">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>
                </button>
              : <button className="btn btn-ghost btn-icon" onClick={() => { clearInterval(timerRef.current); setPlaying(false); }} title="Pause">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                </button>
            }
            <button className="btn btn-ghost btn-icon" onClick={stepBack} disabled={playing || frameIdx <= 0} title="Step back">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6"/><line x1="9" y1="18" x2="9" y2="6"/>
              </svg>
            </button>
            <button className="btn btn-ghost btn-icon" onClick={step} disabled={playing || done} title="Step forward">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"/><line x1="15" y1="18" x2="15" y2="6"/>
              </svg>
            </button>
            <button className="btn btn-ghost btn-icon" onClick={reset} title="Reset">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
            </button>
          </div>
          <button
            className={`btn btn-ghost btn-sm code-toggle ${showCode ? 'active' : ''}`}
            onClick={() => setShowCode(v => !v)}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
        <div className="traversal-desc">
          <span className={`badge ${info.badge}`}>{info.label}</span>
          <span className="desc-text">{info.desc}</span>
        </div>
      </div>

      <div className="tree-main">
        <div className="tree-canvas card">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%">
            {TREE_NODES.map(node => {
              const pos = POSITIONS[node.id];
              return (
                <g key={`edges-${node.id}`}>
                  {node.left && POSITIONS[node.left] && (
                    <line
                      x1={pos.x} y1={pos.y}
                      x2={POSITIONS[node.left].x} y2={POSITIONS[node.left].y}
                      className={`tree-edge ${order.includes(node.left) ? 'visited' : ''}`}
                    />
                  )}
                  {node.right && POSITIONS[node.right] && (
                    <line
                      x1={pos.x} y1={pos.y}
                      x2={POSITIONS[node.right].x} y2={POSITIONS[node.right].y}
                      className={`tree-edge ${order.includes(node.right) ? 'visited' : ''}`}
                    />
                  )}
                </g>
              );
            })}
            {TREE_NODES.map(node => {
              const pos = POSITIONS[node.id];
              const cls = getNodeClass(node.id);
              return (
                <g key={node.id} className={cls} transform={`translate(${pos.x},${pos.y})`}>
                  <circle r={R} />
                  <text dy="0.35em" textAnchor="middle">{node.value}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="tree-log card">
          <h3>Traversal Order</h3>
          <div className="order-list">
            {order.length === 0
              ? <span className="empty-log">No nodes visited yet</span>
              : order.map((id, i) => (
                <div key={i} className={`order-item ${id === highlighted ? 'current' : ''}`}>
                  <span className="order-num">{i + 1}</span>
                  <span className="order-val">{NODE_MAP[id]?.value}</span>
                </div>
              ))
            }
          </div>
        </div>
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
