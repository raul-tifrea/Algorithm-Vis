import React, { useState, useEffect, useCallback, useRef } from 'react';
import './LinkedListVisualizer.css';
import { reverseLinkedList } from '../algorithms/linkedlists/reverse';
import { cycleDetection } from '../algorithms/linkedlists/cycle';
import { insertLinkedList } from '../algorithms/linkedlists/insert';
import { deleteLinkedList } from '../algorithms/linkedlists/delete';
import { removeDuplicates } from '../algorithms/linkedlists/removeDuplicates';

const ALGORITHMS = {
  reverse: {
    label: 'Reverse Linked List',
    desc: 'Reverses a linked list in place using prev, curr, and next pointers.',
    fn: (nodes, headId) => reverseLinkedList(nodes, headId)
  },
  cycle: {
    label: 'Cycle Detection',
    desc: 'Detects a cycle using a slow pointer and a fast pointer.',
    fn: (nodes, headId) => cycleDetection(nodes, headId)
  },
  insert: {
    label: 'Insert Node',
    desc: 'Visually re-wires pointers to insert a node at a given index.',
    fn: (nodes, headId, newId, index) => insertLinkedList(nodes, headId, newId, index)
  },
  delete: {
    label: 'Delete Node',
    desc: 'Visually re-wires pointers to bypass and delete a node.',
    fn: (nodes, headId, targetId) => deleteLinkedList(nodes, headId, targetId)
  },
  removeDuplicates: {
    label: 'Remove Duplicates',
    desc: 'Removes duplicates from a sorted linked list by bypassing nodes with duplicate values.',
    fn: (nodes, headId) => removeDuplicates(nodes, headId)
  }
};

const CODE_SNIPPETS = {
  reverse: {
    cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head, *next = nullptr;
    while (curr != nullptr) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    javascript: `function reverseList(head) {
    let prev = null, curr = head, next = null;
    while (curr !== null) {
        next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    python: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
    java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head, next = null;
    while (curr != null) {
        next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`
  },
  cycle: {
    cpp: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
    javascript: `function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}`,
    python: `def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    java: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`
  },
  insert: {
    cpp: `void insertNode(ListNode* head, int index, int val) {
    ListNode* newNode = new ListNode(val);
    if (index == 0) {
        newNode->next = head;
        return;
    }
    ListNode* curr = head;
    for (int i = 0; curr != nullptr && i < index - 1; i++) {
        curr = curr->next;
    }
    if (curr != nullptr) {
        newNode->next = curr->next;
        curr->next = newNode;
    }
}`,
    javascript: `function insertNode(head, index, val) {
    const newNode = new ListNode(val);
    if (index === 0) {
        newNode.next = head;
        return;
    }
    let curr = head;
    for (let i = 0; curr !== null && i < index - 1; i++) {
        curr = curr.next;
    }
    if (curr !== null) {
        newNode.next = curr.next;
        curr.next = newNode;
    }
}`,
    python: `def insert_node(head, index, val):
    new_node = ListNode(val)
    if index == 0:
        new_node.next = head
        return
    curr = head
    for _ in range(index - 1):
        if not curr: break
        curr = curr.next
    if curr:
        new_node.next = curr.next
        curr.next = new_node`,
    java: `public void insertNode(ListNode head, int index, int val) {
    ListNode newNode = new ListNode(val);
    if (index == 0) {
        newNode.next = head;
        return;
    }
    ListNode curr = head;
    for (int i = 0; curr != null && i < index - 1; i++) {
        curr = curr.next;
    }
    if (curr != null) {
        newNode.next = curr.next;
        curr.next = newNode;
    }
}`
  },
  delete: {
    cpp: `void deleteNode(ListNode* head, int target) {
    ListNode *curr = head, *prev = nullptr;
    while (curr != nullptr && curr->val != target) {
        prev = curr;
        curr = curr->next;
    }
    if (curr == nullptr) return;
    if (prev != nullptr) {
        prev->next = curr->next;
    }
    delete curr;
}`,
    javascript: `function deleteNode(head, target) {
    let curr = head, prev = null;
    while (curr !== null && curr.val !== target) {
        prev = curr;
        curr = curr.next;
    }
    if (curr === null) return;
    if (prev !== null) {
        prev.next = curr.next;
    }
}`,
    python: `def delete_node(head, target):
    curr, prev = head, None
    while curr and curr.val != target:
        prev = curr
        curr = curr.next
    if not curr: return
    if prev:
        prev.next = curr.next`,
    java: `public void deleteNode(ListNode head, int target) {
    ListNode curr = head, prev = null;
    while (curr != null && curr.val != target) {
        prev = curr;
        curr = curr.next;
    }
    if (curr == null) return;
    if (prev != null) {
        prev.next = curr.next;
    }
}`
  },
  removeDuplicates: {
    cpp: `ListNode* deleteDuplicates(ListNode* head) {
    if (!head) return nullptr;
    unordered_set<int> seen;
    ListNode *curr = head, *prev = nullptr;
    while (curr != nullptr) {
        if (seen.count(curr->val)) {
            prev->next = curr->next;
            delete curr;
            curr = prev->next;
        } else {
            seen.insert(curr->val);
            prev = curr;
            curr = curr->next;
        }
    }
    return head;
}`,
    javascript: `function deleteDuplicates(head) {
    if (!head) return null;
    const seen = new Set();
    let curr = head, prev = null;
    while (curr !== null) {
        if (seen.has(curr.val)) {
            prev.next = curr.next;
            curr = prev.next;
        } else {
            seen.add(curr.val);
            prev = curr;
            curr = curr.next;
        }
    }
    return head;
}`,
    python: `def delete_duplicates(head):
    if not head: return None
    seen = set()
    curr, prev = head, None
    while curr:
        if curr.val in seen:
            prev.next = curr.next
            curr = prev.next
        else:
            seen.add(curr.val)
            prev = curr
            curr = curr.next
    return head`,
    java: `public ListNode deleteDuplicates(ListNode head) {
    if (head == null) return null;
    Set<Integer> seen = new HashSet<>();
    ListNode curr = head, prev = null;
    while (curr != null) {
        if (seen.contains(curr.val)) {
            prev.next = curr.next;
            curr = prev.next;
        } else {
            seen.add(curr.val);
            prev = curr;
            curr = curr.next;
        }
    }
    return head;
}`
  }
};

function highlight(code) {
  let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Support both // (JS, Java, C++) and # (Python) comments
  const regex = /(\/\/[^\n]*|#[^\n]*)|('[^']*'|"[^"]*")|\b(function|return|const|let|if|else|while|for|of|new|import|export|default|continue|true|false|null|def|class|public|static|void|int|bool|size_t|std|vector|auto|decltype|ListNode|unordered_set)\b|\b(\d+)\b/g;
  
  return html.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="tok-comment">${p1}</span>`;
    if (p2) return `<span class="tok-str">${p2}</span>`;
    if (p3) return `<span class="tok-kw">${p3}</span>`;
    if (p4) return `<span class="tok-num">${p4}</span>`;
    return match;
  });
}

export default function LinkedListVisualizer() {
  const [globalNodes, setGlobalNodes] = useState([
    { id: 'n0', val: 1, nextId: 'n1' },
    { id: 'n1', val: 2, nextId: 'n2' },
    { id: 'n2', val: 3, nextId: 'n3' },
    { id: 'n3', val: 4, nextId: 'n4' },
    { id: 'n4', val: 5, nextId: null }
  ]);
  const [globalHeadId, setGlobalHeadId] = useState('n0');
  const [unlinkedNodes, setUnlinkedNodes] = useState([]);
  const [algo, setAlgo] = useState('reverse');
  const [codeLang, setCodeLang] = useState('cpp');
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [showCode, setShowCode] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [nextIdCounter, setNextIdCounter] = useState(5);
  
  const [pendingGlobalState, setPendingGlobalState] = useState(null);
  
  const svgRef = useRef(null);
  const timerRef = useRef(null);

  // Rendering parameters
  const startX = 80;
  const startY = 200;
  const nodeW = 50;
  const nodeH = 50;
  const gap = 80;

  const resetState = useCallback(() => {
    clearInterval(timerRef.current);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
    setPendingGlobalState(null);
    setSelectedNodeId(null);
  }, []);

  const triggerAlgorithm = useCallback((algoName, args) => {
    resetState();
    setAlgo(algoName);
    const { frames: f, newHeadId } = ALGORITHMS[algoName].fn(...args);
    setFrames(f);
    setFrameIdx(0);
    setPendingGlobalState({
      nodes: f[f.length - 1].nodes,
      headId: newHeadId
    });
    setPlaying(true);
  }, [resetState]);

  // When playback finishes naturally
  useEffect(() => {
    if (done && pendingGlobalState) {
      // We no longer filter out unreachable nodes so they don't mysteriously disappear
      setGlobalNodes(pendingGlobalState.nodes);
      setGlobalHeadId(pendingGlobalState.headId);
      setPendingGlobalState(null);
    }
  }, [done, pendingGlobalState]);

  const play = useCallback(() => {
    if (done) {
      setFrameIdx(0);
      setDone(false);
    } else if (frames.length === 0) {
      if (algo !== 'cycle') {
        let slow = globalHeadId;
        let fast = globalHeadId;
        let hasCycle = false;
        while (fast !== null) {
          const fastNode = globalNodes.find(n => n.id === fast);
          if (!fastNode || !fastNode.nextId) break;
          const fastNextNode = globalNodes.find(n => n.id === fastNode.nextId);
          if (!fastNextNode || !fastNextNode.nextId) break;
          
          fast = fastNextNode.nextId;
          const slowNode = globalNodes.find(n => n.id === slow);
          slow = slowNode.nextId;
          
          if (slow === fast && slow !== null) {
            hasCycle = true;
            break;
          }
        }
        if (hasCycle) {
          alert("Please break the cycle in your linked list before running this algorithm.");
          return;
        }
      }
      triggerAlgorithm(algo, [globalNodes, globalHeadId]);
    } else {
      setPlaying(true);
    }
  }, [done, frames.length, algo, globalNodes, globalHeadId, triggerAlgorithm]);

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
      }, Math.max(50, 1500 - (speed * 14)));
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed, frames.length]);

  const pause = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
  }, []);

  const handleAddNode = () => {
    if (done) resetState();
    const newId = `n${nextIdCounter}`;
    setNextIdCounter(c => c + 1);
    const val = Math.floor(Math.random() * 99) + 1;
    setUnlinkedNodes(prev => [...prev, { id: newId, val, nextId: null, x: 50 + (unlinkedNodes.length * 70), y: 50 }]);
  };

  const handleDeleteSelected = () => {
    if (!selectedNodeId || playing) return;
    setAlgo('delete');
    triggerAlgorithm('delete', [globalNodes, globalHeadId, selectedNodeId]);
    setSelectedNodeId(null);
  };

  const handleNodeMouseDown = (e, id) => {
    e.stopPropagation();
    if (playing) return;
    if (done) resetState();
    setDraggingNodeId(id);
    setSelectedNodeId(id);
    setIsDragging(false);
  };

  const handleNodeDoubleClick = (e, id) => {
    e.stopPropagation();
    if (playing) return;
    if (done) resetState();
    
    // Find the node in globalNodes or unlinkedNodes
    const gNode = globalNodes.find(n => n.id === id);
    const uNode = unlinkedNodes.find(n => n.id === id);
    const targetNode = gNode || uNode;
    
    if (targetNode) {
      const newVal = prompt("Enter new value for this node:", targetNode.val);
      if (newVal !== null && !isNaN(newVal) && newVal.trim() !== '') {
        const parsed = parseInt(newVal, 10);
        if (gNode) {
          setGlobalNodes(prev => prev.map(n => n.id === id ? { ...n, val: parsed } : n));
          // If frames exist, update the current frame so the UI reflects the edit immediately
          if (frames.length > 0) {
            setFrames(prevFrames => {
               const newFrames = [...prevFrames];
               if (newFrames[frameIdx]) {
                 newFrames[frameIdx] = {
                   ...newFrames[frameIdx],
                   nodes: newFrames[frameIdx].nodes.map(n => n.id === id ? { ...n, val: parsed } : n)
                 };
               }
               return newFrames;
            });
          }
        } else if (uNode) {
          setUnlinkedNodes(prev => prev.map(n => n.id === id ? { ...n, val: parsed } : n));
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId || !svgRef.current) return;
    setIsDragging(true);
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    
    // Only update unlinked nodes visually; global nodes use cycle-creation line
    setUnlinkedNodes(prev => 
      prev.map(n => n.id === draggingNodeId ? { ...n, x, y } : n)
    );
  };

  const handleMouseUp = () => {
    if (!draggingNodeId) return;
    
    if (!isDragging) {
      setDraggingNodeId(null);
      return;
    }

    const droppedNode = unlinkedNodes.find(n => n.id === draggingNodeId);
    if (droppedNode) {
        // Did they drop it near the list?
        if (mousePos.y > startY - 70 && mousePos.y < startY + 70) {
            // Find physical insertion index based on X position
            let insertIdx = 0;
            let currentX = startX;
            for (let i = 0; i < renderNodes.length; i++) {
               if (mousePos.x < currentX + nodeW/2) break;
               insertIdx++;
               currentX += (nodeW + gap);
            }
            
            // Determine logical targetId
            let targetId = null;
            const leftNode = insertIdx > 0 ? renderNodes[insertIdx - 1] : null;
            const rightNode = insertIdx < renderNodes.length ? renderNodes[insertIdx] : null;
            
            if (leftNode && rightNode && leftNode.nextId === rightNode.id) {
                targetId = rightNode.id;
            } else if (leftNode && rightNode && rightNode.nextId === leftNode.id) {
                targetId = leftNode.id;
            } else if (rightNode) {
                targetId = rightNode.id;
            }

            setUnlinkedNodes(prev => prev.filter(n => n.id !== draggingNodeId));
            const nodeToAdd = { ...droppedNode };
            delete nodeToAdd.x;
            delete nodeToAdd.y;
            
            const newGlobal = [...globalNodes];
            newGlobal.splice(insertIdx, 0, nodeToAdd);
            setGlobalNodes(newGlobal);
            
            setAlgo('insert');
            triggerAlgorithm('insert', [newGlobal, globalHeadId, draggingNodeId, targetId]);
        }
    } else {
        // Dragging a global node to create/break connections
        const draggedGlobal = globalNodes.find(n => n.id === draggingNodeId);
        if (draggedGlobal && !playing) {
            // Find if dropped on another global node
            let droppedOnNodeId = null;
            for (const n of globalNodes) {
                const pos = getNodePos(n.id);
                const dist = Math.sqrt(Math.pow(pos.x - mousePos.x, 2) + Math.pow(pos.y - mousePos.y, 2));
                if (dist < 40) {
                    droppedOnNodeId = n.id;
                    break;
                }
            }
            
            if (droppedOnNodeId) {
                setGlobalNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, nextId: droppedOnNodeId } : n));
            } else {
                setGlobalNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, nextId: null } : n));
            }
        }
    }
    
    setDraggingNodeId(null);
  };

  // Determine which state to render
  const isAnimating = frames.length > 0;
  const currentFrame = isAnimating ? frames[frameIdx] : null;
  const renderNodes = currentFrame ? currentFrame.nodes : globalNodes;
  const pointers = currentFrame ? currentFrame.pointers : {};

  let instructions = 'Click "+ Add Node" to start building. Press Play to run an algorithm.';
  if (unlinkedNodes.length > 0) {
    instructions = 'Drag the green node into the list, or double-click to change its value.';
  } else if (selectedNodeId) {
    instructions = 'Node selected. You can click the Trash icon to delete it.';
  } else if (isAnimating) {
    instructions = currentFrame?.action || 'Running...';
  }

  const getNodePos = (id) => {
    // If it's an unlinked node being dragged, use its raw x/y
    const unlinked = unlinkedNodes.find(n => n.id === id);
    if (unlinked) return { x: unlinked.x, y: unlinked.y };

    // Calculate indices based only on non-deleted nodes so they slide left
    const activeNodes = renderNodes.filter(n => !n.deleted);
    const idx = activeNodes.findIndex(n => n.id === id);
    if (idx === -1) {
       // If it's a deleted node fading out, look up its original index in globalNodes
       const oldIdx = globalNodes.findIndex(n => n.id === id);
       return { x: startX + oldIdx * (nodeW + gap), y: startY };
    }
    
    return {
      x: startX + idx * (nodeW + gap),
      y: startY
    };
  };

  return (
    <div className="ll-vis fade-in-up" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="ll-controls card">
        <div className="ctrl-row">
          <div className="segmented-control" style={{ overflowX: 'auto' }}>
            <button className={`segment-btn ${algo === 'reverse' ? 'active' : ''}`} onClick={() => { resetState(); setAlgo('reverse'); }} disabled={playing}>Reverse</button>
            <button className={`segment-btn ${algo === 'cycle' ? 'active' : ''}`} onClick={() => { resetState(); setAlgo('cycle'); }} disabled={playing}>Cycle Detection</button>
            <button className={`segment-btn ${algo === 'removeDuplicates' ? 'active' : ''}`} onClick={() => { resetState(); setAlgo('removeDuplicates'); }} disabled={playing}>Remove Duplicates</button>
          </div>
          
          <span className="ctrl-sep" />
          
          <div className="playback-btns">
            {!playing
              ? <button className="btn btn-primary btn-icon" onClick={play} disabled={done && frames.length > 0} title="Play">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
              </button>
              : <button className="btn btn-ghost btn-icon" onClick={pause} title="Pause">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              </button>
            }
            <button className="btn btn-ghost btn-icon" onClick={() => { pause(); setFrameIdx(0); setDone(false); }} title="Restart">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
              </svg>
            </button>
          </div>
          
          <span className="ctrl-sep" />
          
          <div className="ctrl-group">
            <label>Speed <span className="mono">{speed}%</span></label>
            <input type="range" min={1} max={100} value={speed} onChange={e => setSpeed(+e.target.value)} />
          </div>

          <span className="ctrl-sep" />
          
          <button 
            className={`btn btn-ghost btn-sm code-toggle ${showCode ? 'active' : ''}`}
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>

          <span className="ctrl-sep" />
          <button className="btn btn-sm btn-ghost" onClick={handleAddNode} disabled={playing}>+ Add Node</button>
          
          <button 
            className="btn btn-ghost btn-icon" 
            onClick={handleDeleteSelected} 
            disabled={playing || !selectedNodeId} 
            title="Delete Selected Node"
            style={{ color: selectedNodeId ? 'var(--neon-red)' : '' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`ll-body ${showCode ? 'with-code' : ''}`}>
        <div className="ll-canvas card" style={{ padding: 0 }}>
          <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 10 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{instructions}</strong>
            </span>
          </div>

          <svg width="100%" height="100%" ref={svgRef} onMouseDown={() => setSelectedNodeId(null)}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="ll-pointer-head" />
              </marker>
              <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--neon-green)" />
              </marker>
            </defs>

            {/* Draw active connection line being dragged */}
            {isDragging && draggingNodeId && globalNodes.find(n => n.id === draggingNodeId) && (
              <line 
                x1={getNodePos(draggingNodeId).x} 
                y1={getNodePos(draggingNodeId).y} 
                x2={mousePos.x} 
                y2={mousePos.y} 
                stroke="var(--neon-green)" 
                strokeWidth="2.5" 
                strokeDasharray="5"
                markerEnd="url(#arrowhead-active)"
              />
            )}

            {/* Draw active nodes */}
            {renderNodes.map(node => {
              const { x, y } = getNodePos(node.id);
              const isSelected = selectedNodeId === node.id;
              const isDeleted = node.deleted;
              return (
                <g key={node.id} className="ll-node-group" transform={`translate(${x}, ${y})`} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)} style={{ cursor: 'pointer', opacity: isDeleted ? 0 : 1, transition: 'transform 0.5s ease, opacity 0.5s ease' }}>
                  <rect x={-nodeW/2} y={-nodeH/2} width={nodeW} height={nodeH} rx={8} className="ll-node-rect" style={isSelected ? { stroke: 'var(--neon-purple)' } : {}} />
                  <text className="ll-node-text">{node.val}</text>
                </g>
              );
            })}
            
            {/* Draw unlinked nodes */}
            {unlinkedNodes.map(node => {
              const { x, y } = getNodePos(node.id);
              const isSelected = selectedNodeId === node.id;
              return (
                <g key={node.id} className="ll-node-group" transform={`translate(${x}, ${y})`} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)} style={{ cursor: 'grab' }}>
                  <rect x={-nodeW/2} y={-nodeH/2} width={nodeW} height={nodeH} rx={8} className="ll-node-rect" style={isSelected ? { stroke: 'var(--neon-purple)' } : { stroke: 'var(--neon-green)' }} />
                  <text className="ll-node-text">{node.val}</text>
                </g>
              );
            })}

            {/* Draw next pointers */}
            {renderNodes.map((node, i) => {
              if (!node.nextId) return null;
              const fromPos = getNodePos(node.id);
              const toPos = getNodePos(node.nextId);
              const toIdx = renderNodes.findIndex(n => n.id === node.nextId);
              
              if (fromPos.x === 0 || toPos.x === 0) return null;

              let d = '';
              if (toIdx === i) {
                // Self-loop
                d = `M ${fromPos.x + 10} ${fromPos.y - nodeH/2} A 20 20 0 1 1 ${fromPos.x - 10} ${fromPos.y - nodeH/2}`;
              } else if (toIdx === i + 1) {
                // Forward pointer (Straight line using Q for smooth CSS transition to curves)
                const x1 = fromPos.x + nodeW/2;
                const y1 = fromPos.y;
                const x2 = toPos.x - nodeW/2 - 2;
                const y2 = toPos.y;
                d = `M ${x1} ${y1} Q ${(x1 + x2)/2} ${(y1 + y2)/2} ${x2} ${y2}`;
              } else if (toIdx === i - 1) {
                d = `M ${fromPos.x - nodeW/2} ${fromPos.y - 10} Q ${fromPos.x - nodeW/2 - gap/2} ${fromPos.y - 60} ${toPos.x + nodeW/2 + 2} ${toPos.y - 10}`;
              } else if (toIdx < i) {
                d = `M ${fromPos.x} ${fromPos.y + nodeH/2} Q ${(fromPos.x + toPos.x)/2} ${fromPos.y + 70} ${toPos.x} ${toPos.y + nodeH/2 + 2}`;
              } else {
                d = `M ${fromPos.x} ${fromPos.y - nodeH/2} Q ${(fromPos.x + toPos.x)/2} ${fromPos.y - 70} ${toPos.x} ${toPos.y - nodeH/2 - 2}`;
              }

              return <path key={`ptr-${node.id}`} d={d} className="ll-pointer-line" markerEnd="url(#arrowhead)" />;
            })}

            {/* Draw variable pointer lines (First Pass: Lines under backgrounds) */}
            {(() => {
              const pointersByNode = {};
              Object.entries(pointers).forEach(([ptrName, nodeId]) => {
                if (!nodeId) return;
                if (!pointersByNode[nodeId]) pointersByNode[nodeId] = [];
                pointersByNode[nodeId].push(ptrName);
              });
              
              return Object.entries(pointersByNode).flatMap(([nodeId, ptrNames]) => {
                const pos = getNodePos(nodeId);
                return ptrNames.map((ptrName, idx) => {
                  const yOffset = 45 + (idx * 28);
                  const isTop = idx === 0;
                  const y2 = isTop ? (-yOffset + nodeH/2 + 4) : (-28 + 10);
                  const isDeletedNode = renderNodes.find(n => n.id === nodeId)?.deleted;
                  return (
                    <g key={`var-line-${ptrName}`} className={`ptr-${ptrName}`} style={{ transition: 'transform 0.5s ease, opacity 0.5s ease', opacity: isDeletedNode ? 0 : 1 }} transform={`translate(${pos.x}, ${pos.y + yOffset})`}>
                      <line x1="0" y1="-10" x2="0" y2={y2} stroke="var(--text-dim)" strokeDasharray="3 3" />
                    </g>
                  );
                });
              });
            })()}

            {/* Draw variable pointer labels (Second Pass: Backgrounds on top) */}
            {(() => {
              const pointersByNode = {};
              Object.entries(pointers).forEach(([ptrName, nodeId]) => {
                if (!nodeId) return;
                if (!pointersByNode[nodeId]) pointersByNode[nodeId] = [];
                pointersByNode[nodeId].push(ptrName);
              });
              
              return Object.entries(pointersByNode).flatMap(([nodeId, ptrNames]) => {
                const pos = getNodePos(nodeId);
                return ptrNames.map((ptrName, idx) => {
                  const yOffset = 45 + (idx * 28);
                  const isDeletedNode = renderNodes.find(n => n.id === nodeId)?.deleted;
                  return (
                    <g key={`var-label-${ptrName}`} className={`ptr-${ptrName}`} style={{ transition: 'transform 0.5s ease, opacity 0.5s ease', opacity: isDeletedNode ? 0 : 1 }} transform={`translate(${pos.x}, ${pos.y + yOffset})`}>
                      <rect x="-24" y="-10" width="48" height="20" className="ll-label-bg" />
                      <text className="ll-label-text" y="4">{ptrName}</text>
                    </g>
                  );
                });
              });
            })()}
          </svg>
        </div>
        
        
        {showCode && (
          <div className="code-panel card">
            <div className="code-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="code-panel-title">{ALGORITHMS[algo] ? ALGORITHMS[algo].label : (algo === 'insert' ? 'Insert Node' : 'Delete Node')}</span>
              </div>
              <div className="code-lang-tabs">
                {['cpp', 'javascript', 'python', 'java'].map(l => (
                  <button key={l} className={`lang-tab ${codeLang === l ? 'active' : ''}`} onClick={() => setCodeLang(l)}>
                    {l === 'javascript' ? 'JS' : l === 'python' ? 'Python' : l === 'java' ? 'Java' : 'C++'}
                  </button>
                ))}
              </div>
            </div>
            <pre
              className="code-block"
              dangerouslySetInnerHTML={{ __html: highlight(CODE_SNIPPETS[algo][codeLang] || CODE_SNIPPETS[algo].cpp) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
