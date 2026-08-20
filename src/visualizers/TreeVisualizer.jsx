import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
} from '../algorithms/trees/traversals';
import { bstSearch, bstInsert } from '../algorithms/trees/bst';
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

function generateRandomBST() {
  const targetCount = 6 + Math.floor(Math.random() * 6); // 6 to 11 nodes
  const MAX_DEPTH = 4;
  let idCounter = 1;
  const nodes = [];
  
  const rootValue = 40 + Math.floor(Math.random() * 20); // 40-59
  const rootId = `n${idCounter++}`;
  nodes.push({ id: rootId, value: rootValue, left: null, right: null });
  
  let attempts = 0;
  while (nodes.length < targetCount && attempts < 100) {
    attempts++;
    const val = 10 + Math.floor(Math.random() * 90);
    
    let curr = rootId;
    let currDepth = 1;
    let parent = null;
    let side = null;
    
    while (curr != null && currDepth < MAX_DEPTH) {
      const node = nodes.find(n => n.id === curr);
      if (val === node.value) break; // duplicate
      parent = node;
      if (val < node.value) {
        curr = node.left;
        side = 'left';
      } else {
        curr = node.right;
        side = 'right';
      }
      currDepth++;
    }
    
    if (curr == null && currDepth <= MAX_DEPTH && parent) {
      const childId = `n${idCounter++}`;
      nodes.push({ id: childId, value: val, left: null, right: null });
      parent[side] = childId;
    }
  }
  
  return { nodes, rootId };
}

function isBST(nodes, rootId) {
  const nodeMap = {};
  for (let i = 0; i < nodes.length; i++) nodeMap[nodes[i].id] = nodes[i];
  
  function check(nodeId, min, max) {
    if (!nodeId) return true;
    const node = nodeMap[nodeId];
    if (node.value <= min || node.value >= max) return false;
    return check(node.left, min, node.value) && check(node.right, node.value, max);
  }
  return check(rootId, -Infinity, Infinity);
}

const CODE_SNIPPETS = {
  inorder: {
    javascript: `function inorder(node) {
  // Base case: if node is null, return
  if (!node) return;

  // 1. Recursively traverse the left subtree
  inorder(node.left);
  // 2. Visit the root node
  console.log(node);
  // 3. Recursively traverse the right subtree
  inorder(node.right);
}`,
    python: `def inorder(node):
    # Base case: if node is None, return
    if not node: return
    
    # 1. Recursively traverse the left subtree
    inorder(node.left)
    # 2. Visit the root node
    print(node)
    # 3. Recursively traverse the right subtree
    inorder(node.right)`,
    java: `public static void inorder(Node node) {
    // Base case: if node is null, return
    if (node == null) return;
    
    // 1. Recursively traverse the left subtree
    inorder(node.left);
    // 2. Visit the root node
    System.out.println(node);
    // 3. Recursively traverse the right subtree
    inorder(node.right);
}`,
    cpp: `void inorder(Node* node) {
    // Base case: if node is null, return
    if (!node) return;
    
    // 1. Recursively traverse the left subtree
    inorder(node->left);
    // 2. Visit the root node
    std::cout << node << "\\n";
    // 3. Recursively traverse the right subtree
    inorder(node->right);
}`
  },
  preorder: {
    javascript: `function preorder(node) {
  // Base case: if node is null, return
  if (!node) return;

  // 1. Visit the root node
  console.log(node);
  // 2. Recursively traverse the left subtree
  preorder(node.left);
  // 3. Recursively traverse the right subtree
  preorder(node.right);
}`,
    python: `def preorder(node):
    # Base case: if node is None, return
    if not node: return
    
    # 1. Visit the root node
    print(node)
    # 2. Recursively traverse the left subtree
    preorder(node.left)
    # 3. Recursively traverse the right subtree
    preorder(node.right)`,
    java: `public static void preorder(Node node) {
    // Base case: if node is null, return
    if (node == null) return;
    
    // 1. Visit the root node
    System.out.println(node);
    // 2. Recursively traverse the left subtree
    preorder(node.left);
    // 3. Recursively traverse the right subtree
    preorder(node.right);
}`,
    cpp: `void preorder(Node* node) {
    // Base case: if node is null, return
    if (!node) return;
    
    // 1. Visit the root node
    std::cout << node << "\\n";
    // 2. Recursively traverse the left subtree
    preorder(node->left);
    // 3. Recursively traverse the right subtree
    preorder(node->right);
}`
  },
  postorder: {
    javascript: `function postorder(node) {
  // Base case: if node is null, return
  if (!node) return;

  // 1. Recursively traverse the left subtree
  postorder(node.left);
  // 2. Recursively traverse the right subtree
  postorder(node.right);
  // 3. Visit the root node
  console.log(node);
}`,
    python: `def postorder(node):
    # Base case: if node is None, return
    if not node: return
    
    # 1. Recursively traverse the left subtree
    postorder(node.left)
    # 2. Recursively traverse the right subtree
    postorder(node.right)
    # 3. Visit the root node
    print(node)`,
    java: `public static void postorder(Node node) {
    // Base case: if node is null, return
    if (node == null) return;
    
    // 1. Recursively traverse the left subtree
    postorder(node.left);
    // 2. Recursively traverse the right subtree
    postorder(node.right);
    // 3. Visit the root node
    System.out.println(node);
}`,
    cpp: `void postorder(Node* node) {
    // Base case: if node is null, return
    if (!node) return;
    
    // 1. Recursively traverse the left subtree
    postorder(node->left);
    // 2. Recursively traverse the right subtree
    postorder(node->right);
    // 3. Visit the root node
    std::cout << node << "\\n";
}`
  },
  bstSearch: {
    javascript: `function bstSearch(node, target) {
  while (node !== null) {
    if (target === node.value) return node; // Found it!
    if (target < node.value) node = node.left; // Go left
    else node = node.right; // Go right
  }
  return null; // Not found
}`,
    python: `def bst_search(node, target):
    while node is not None:
        if target == node.value: return node # Found it!
        if target < node.value: node = node.left # Go left
        else: node = node.right # Go right
    return None # Not found`,
    java: `public static Node bstSearch(Node node, int target) {
    while (node != null) {
        if (target == node.value) return node; // Found it!
        if (target < node.value) node = node.left; // Go left
        else node = node.right; // Go right
    }
    return null; // Not found
}`,
    cpp: `Node* bstSearch(Node* node, int target) {
    while (node != nullptr) {
        if (target == node->value) return node; // Found it!
        if (target < node->value) node = node->left; // Go left
        else node = node->right; // Go right
    }
    return nullptr; // Not found
}`
  },
  bstInsert: {
    javascript: `function bstInsert(node, target) {
  if (!node) return new Node(target);
  
  let curr = node;
  while (true) {
    if (target === curr.value) return node; // Duplicate, don't insert
    if (target < curr.value) {
      if (!curr.left) { curr.left = new Node(target); break; }
      curr = curr.left;
    } else {
      if (!curr.right) { curr.right = new Node(target); break; }
      curr = curr.right;
    }
  }
  return node;
}`,
    python: `def bst_insert(node, target):
    if not node: return Node(target)
    
    curr = node
    while True:
        if target == curr.value: return node # Duplicate, don't insert
        if target < curr.value:
            if not curr.left: 
                curr.left = Node(target)
                break
            curr = curr.left
        else:
            if not curr.right: 
                curr.right = Node(target)
                break
            curr = curr.right
    return node`,
    java: `public static Node bstInsert(Node node, int target) {
    if (node == null) return new Node(target);
    
    Node curr = node;
    while (true) {
        if (target == curr.value) return node; // Duplicate, don't insert
        if (target < curr.value) {
            if (curr.left == null) { curr.left = new Node(target); break; }
            curr = curr.left;
        } else {
            if (curr.right == null) { curr.right = new Node(target); break; }
            curr = curr.right;
        }
    }
    return node;
}`,
    cpp: `Node* bstInsert(Node* node, int target) {
    if (!node) return new Node(target);
    
    Node* curr = node;
    while (true) {
        if (target == curr->value) return node; // Duplicate, don't insert
        if (target < curr->value) {
            if (!curr->left) { curr->left = new Node(target); break; }
            curr = curr->left;
        } else {
            if (!curr->right) { curr->right = new Node(target); break; }
            curr = curr->right;
        }
    }
    return node;
}`
  }
};

const TRAVERSALS = {
  inorder:   { fn: inorderTraversal,   label: 'In-order',   desc: 'Left → Root → Right', badge: 'badge-blue', explanation: 'Visits the left subtree, then the root node, and finally the right subtree. In a Binary Search Tree, this visits nodes in ascending sorted order.' },
  preorder:  { fn: preorderTraversal,  label: 'Pre-order',  desc: 'Root → Left → Right', badge: 'badge-purple', explanation: 'Visits the root node first, then recursively visits the left subtree, followed by the right subtree. Often used to create a copy of the tree.' },
  postorder: { fn: postorderTraversal, label: 'Post-order', desc: 'Left → Right → Root', badge: 'badge-yellow', explanation: 'Visits the left subtree, then the right subtree, and finally the root node. Often used to safely delete the tree from leaves to root.' },
  bstSearch: { fn: bstSearch,          label: 'BST Search', desc: 'Search for a target value in a Binary Search Tree', badge: 'badge-cyan', explanation: 'Starting from the root, compares the target value to the current node. If smaller, goes left; if larger, goes right. Achieves O(log n) time on balanced trees.' },
  bstInsert: { fn: bstInsert,          label: 'BST Insert', desc: 'Insert a new value into a Binary Search Tree', badge: 'badge-green', explanation: 'Traverses the tree exactly like a search to find the correct empty leaf spot, then places the new value there to maintain the BST sorted property.' },
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
  let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Support both // (JS, Java, C++) and # (Python) comments
  const regex = /(\/\/[^\n]*|#[^\n]*)|('[^']*'|"[^"]*")|\b(function|return|const|let|if|else|while|for|of|new|import|export|default|continue|true|false|null|def|class|public|static|void|int|bool|size_t|std|vector|auto|decltype)\b|\b(\d+)\b/g;
  
  return html.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="tok-comment">${p1}</span>`;
    if (p2) return `<span class="tok-str">${p2}</span>`;
    if (p3) return `<span class="tok-kw">${p3}</span>`;
    if (p4) return `<span class="tok-num">${p4}</span>`;
    return match;
  });
}

export default function TreeVisualizer() {
  const [traversal, setTraversal] = useState('inorder');
  const [codeLang, setCodeLang] = useState('javascript');
  const [speed, setSpeed] = useState(50);
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [insertValue, setInsertValue] = useState('50');
  const [searchTarget, setSearchTarget] = useState(null);
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
    const isBST = traversal.startsWith('bst');
    const { nodes, rootId: newRoot } = isBST ? generateRandomBST() : generateRandomTree();
    setTreeNodes(nodes);
    setRootId(newRoot);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
    setSearchTarget(null);
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
      let target = null;
      if (traversal === 'bstSearch') target = searchTarget ?? treeNodes[0].value;
      if (traversal === 'bstInsert') target = parseInt(insertValue, 10);
      
      const res = TRAVERSALS[traversal].fn(treeNodes, rootId, target);
      if (res.frames) {
        setFrames(res.frames);
        if (res.newTree) setTreeNodes(res.newTree);
      } else {
        setFrames(res);
      }
      setFrameIdx(-1);
      setDone(false);
    }
    setPlaying(true);
  }, [frames.length, done, traversal, treeNodes, rootId, searchTarget, insertValue]);

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
      let target = null;
      if (traversal === 'bstSearch') target = searchTarget ?? treeNodes[0].value;
      if (traversal === 'bstInsert') target = parseInt(insertValue, 10);
      
      const res = TRAVERSALS[traversal].fn(treeNodes, rootId, target);
      if (res.frames) {
        f = res.frames;
        setFrames(f);
        if (res.newTree) setTreeNodes(res.newTree);
      } else {
        f = res;
        setFrames(f);
      }
    }
    setFrameIdx(i => {
      const next = Math.min(i + 1, f.length - 1);
      if (next === f.length - 1) setDone(true);
      return next;
    });
  }, [frames, traversal, treeNodes, rootId, searchTarget, insertValue]);

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

  const handleInsertClick = () => {
    const val = parseInt(insertValue, 10);
    if (isNaN(val)) return;
    
    let curr = rootId;
    let depth = 1;
    let err = null;
    
    while (curr != null) {
      const node = nodeMap[curr];
      if (val === node.value) { err = 'Value already exists!'; break; }
      if (val < node.value) curr = node.left;
      else curr = node.right;
      
      if (curr != null) depth++;
      else if (depth + 1 > 4) err = 'Max depth of 4 reached!';
    }
    
    if (err) {
      showToast(err);
      return;
    }
    
    play();
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
              onClick={() => { 
                if (key.startsWith('bst') && !isBST(treeNodes, rootId)) {
                  const { nodes, rootId: newRoot } = generateRandomBST();
                  setTreeNodes(nodes);
                  setRootId(newRoot);
                }
                setTraversal(key); 
                reset(); 
                exitQuiz(); 
              }}
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
          {traversal === 'bstInsert' && !quizMode && (
            <>
              <span className="ctrl-sep" />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="bst-stepper-wrap">
                  <button className="btn-stepper" onClick={() => setInsertValue(v => Math.max(1, parseInt(v||0) - 1))} disabled={playing}>−</button>
                  <input type="number" min="1" max="99" value={insertValue} onChange={e => setInsertValue(e.target.value)} className="bst-input-stepper" disabled={playing} />
                  <button className="btn-stepper" onClick={() => setInsertValue(v => Math.min(99, parseInt(v||0) + 1))} disabled={playing}>+</button>
                </div>
                <button className="btn btn-sm btn-primary" onClick={handleInsertClick} disabled={playing}>Insert</button>
              </div>
            </>
          )}
          {!quizMode && (
            <>
              <span className="ctrl-sep" />
              <div className="ctrl-group">
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
              {traversal === 'bstSearch' && <span className="desc-text" style={{ color: 'var(--neon-yellow)' }}> - Click any node to set as target, then press Play!</span>}
              {traversal === 'bstInsert' && <span className="desc-text" style={{ color: 'var(--neon-green)' }}> - Type a number in the input box and press Play!</span>}
            </div>
        }
      </div>

      {showDesc && !quizMode && (
        <div className="card fade-in-up" style={{ marginBottom: '20px', background: 'var(--bg-secondary)', borderLeft: `4px solid var(--neon-${info.badge.split('-')[1] || 'blue'})`, padding: '16px 20px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{info.label}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
            {info.explanation}
          </p>
        </div>
      )}

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
              const hideNodes = currentFrame?.hideNodes ?? [];
              if (!pos || hideNodes.includes(node.id)) return null;
              
              const quizEdgeLeft  = quizMode && quizClicks.includes(node.id) && node.left  && quizClicks.includes(node.left);
              const quizEdgeRight = quizMode && quizClicks.includes(node.id) && node.right && quizClicks.includes(node.right);
              return (
                <g key={`edges-${node.id}`}>
                  {node.left && positions[node.left] && !hideNodes.includes(node.left) && (
                    <line
                      x1={pos.x} y1={pos.y}
                      x2={positions[node.left].x} y2={positions[node.left].y}
                      className={`tree-edge ${quizMode ? (quizEdgeLeft ? 'visited' : '') : (order.includes(node.left) ? 'visited' : '')}`}
                    />
                  )}
                  {node.right && positions[node.right] && !hideNodes.includes(node.right) && (
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
              const hideNodes = currentFrame?.hideNodes ?? [];
              if (!pos || hideNodes.includes(node.id)) return null;
              
              const cls = getNodeClass(node.id);
              const isSearchTarget = traversal === 'bstSearch' && node.value === searchTarget;
              const finalCls = isSearchTarget ? `${cls} search-target` : cls;
              
              const quizClickable = quizMode && !quizDone && !quizClicks.includes(node.id);
              const searchClickable = traversal === 'bstSearch' && !playing;
              const clickable = quizClickable || searchClickable;
              
              const stepNum = quizClicks.indexOf(node.id);
              
              const onNodeClick = () => {
                if (quizClickable) handleQuizClick(node.id);
                else if (searchClickable) {
                  setSearchTarget(node.value);
                  reset();
                  showToast(`Target set to ${node.value}. Press Play!`);
                }
              };

              return (
                <g
                  key={node.id}
                  className={finalCls}
                  transform={`translate(${pos.x},${pos.y})`}
                  onClick={clickable ? onNodeClick : undefined}
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
            <h3>{traversal.startsWith('bst') ? 'BST Log' : 'Traversal Order'}</h3>
            <div className="order-list">
              {currentFrame?.notFound && <div className="order-item"><span className="order-val" style={{color:'var(--neon-red)'}}>Not Found!</span></div>}
              {currentFrame?.error && <div className="order-item"><span className="order-val" style={{color:'var(--neon-red)'}}>{currentFrame.error}</span></div>}
              {order.length === 0 && !currentFrame?.notFound && !currentFrame?.error
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="code-panel-title">{info.label} Traversal</span>
              <span className={`badge ${info.badge}`}>{info.desc}</span>
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
            dangerouslySetInnerHTML={{ __html: highlight(CODE_SNIPPETS[traversal][codeLang] || CODE_SNIPPETS[traversal].javascript) }}
          />
        </div>
      )}
    </div>
  );
}
