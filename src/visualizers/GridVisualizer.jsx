import React, { useState, useEffect, useCallback, useRef } from 'react';
import './GridVisualizer.css';
import { pathfindingTraversal } from '../algorithms/pathfinding/astar';
import { dfsMaze } from '../algorithms/pathfinding/mazes';

const ROWS = 21;
const COLS = 41;
const DEFAULT_START = { row: 11, col: 5 };
const DEFAULT_END = { row: 11, col: 35 };

const ALGORITHMS = {
  astar: {
    label: 'A* Search',
    desc: 'A* Search uses a heuristic (Manhattan distance) to guide its search towards the target, making it generally faster than Dijkstra.',
    fn: (grid, s, e) => pathfindingTraversal(grid, s, e, false)
  },
  dijkstra: {
    label: 'Dijkstra',
    desc: 'Dijkstra explores equally in all directions until it finds the target. It guarantees the shortest path but is slower than A*.',
    fn: (grid, s, e) => pathfindingTraversal(grid, s, e, true)
  }
};

const CODE_SNIPPETS = {
  astar: {
    cpp: `void aStar(Grid& grid, Node* start, Node* end) {
    std::priority_queue<Node*, std::vector<Node*>, CompareF> openSet;
    start->g = 0;
    start->f = heuristic(start, end);
    openSet.push(start);
    
    while (!openSet.empty()) {
        Node* current = openSet.top();
        openSet.pop();
        
        if (current == end) return reconstructPath(end);
        
        current->visited = true;
        
        for (Node* neighbor : getNeighbors(current)) {
            if (neighbor->isWall || neighbor->visited) continue;
            
            float tentative_g = current->g + 1; // Assuming edge weight 1
            if (tentative_g < neighbor->g) {
                neighbor->cameFrom = current;
                neighbor->g = tentative_g;
                neighbor->f = tentative_g + heuristic(neighbor, end);
                openSet.push(neighbor);
            }
        }
    }
}`
  },
  dijkstra: {
    cpp: `void dijkstra(Grid& grid, Node* start, Node* end) {
    std::priority_queue<Node*, std::vector<Node*>, CompareG> pq;
    start->g = 0;
    pq.push(start);
    
    while (!pq.empty()) {
        Node* current = pq.top();
        pq.pop();
        
        if (current == end) return reconstructPath(end);
        
        current->visited = true;
        
        for (Node* neighbor : getNeighbors(current)) {
            if (neighbor->isWall || neighbor->visited) continue;
            
            float tentative_g = current->g + 1;
            if (tentative_g < neighbor->g) {
                neighbor->cameFrom = current;
                neighbor->g = tentative_g;
                pq.push(neighbor);
            }
        }
    }
}`
  }
};

const createEmptyGrid = () => {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const currentRow = [];
    for (let c = 0; c < COLS; c++) {
      currentRow.push({
        row: r,
        col: c,
        isWall: false,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

export default function GridVisualizer() {
  const [algo, setAlgo] = useState('astar');
  const [grid, setGrid] = useState(() => createEmptyGrid());
  const [startNode, setStartNode] = useState(DEFAULT_START);
  const [endNode, setEndNode] = useState(DEFAULT_END);
  const [dragMode, setDragMode] = useState(null); 
  
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [drawingMaze, setDrawingMaze] = useState(false);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(70);
  const [timerMs, setTimerMs] = useState(0);
  
  const [showCode, setShowCode] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const timerRef = useRef(null);

  const resetPaths = useCallback(() => {
    clearInterval(timerRef.current);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDrawingMaze(false);
    setDone(false);
    setTimerMs(0);
  }, []);

  const clearBoard = useCallback(() => {
    resetPaths();
    setGrid(createEmptyGrid());
    setStartNode(DEFAULT_START);
    setEndNode(DEFAULT_END);
  }, [resetPaths]);

  const generateMaze = () => {
    resetPaths();
    const emptyGrid = createEmptyGrid();
    setGrid(emptyGrid);
    
    setTimeout(() => {
      let mazeFrames = dfsMaze(ROWS, COLS);
      
      let i = 0;
      setDrawingMaze(true);
      const timer = setInterval(() => {
        if (i >= mazeFrames.length) {
          clearInterval(timer);
          setDrawingMaze(false);

          setGrid(prev => {
             const finalGrid = [...prev];
             
             const sRow = [...finalGrid[startNode.row]];
             sRow[startNode.col] = { ...sRow[startNode.col], isWall: false };
             finalGrid[startNode.row] = sRow;
             
             const eRow = [...finalGrid[endNode.row]];
             eRow[endNode.col] = { ...eRow[endNode.col], isWall: false };
             finalGrid[endNode.row] = eRow;
             
             return finalGrid;
          });
          return;
        }
        
        setGrid(prev => {
          const newGrid = [...prev];
          let count = 0;
          
          while (i < mazeFrames.length && count < 6) {
            const frame = mazeFrames[i];
            const newRow = [...newGrid[frame.row]];
            newRow[frame.col] = { ...newRow[frame.col], isWall: frame.isWall };
            newGrid[frame.row] = newRow;
            i++;
            count++;
          }
          return newGrid;
        });
      }, 10);
      timerRef.current = timer;
    }, 50);
  };

  const handleMouseDown = (e, row, col) => {
    e.preventDefault();
    if (playing || drawingMaze) return;
    
    if (isStart(row, col)) {
      setDragMode('move-start');
      return;
    }
    if (isEnd(row, col)) {
      setDragMode('move-end');
      return;
    }
    
    resetPaths();
    const newGrid = [...grid];
    const isCurrentlyWall = newGrid[row][col].isWall;
    newGrid[row][col].isWall = !isCurrentlyWall;
    
    setGrid(newGrid);
    setDragMode(isCurrentlyWall ? 'erase' : 'draw');
  };

  const handleMouseEnter = (row, col) => {
    if (!dragMode || playing || drawingMaze) return;
    
    if (dragMode === 'move-start') {
      if (!isEnd(row, col)) {
        setStartNode({ row, col });
        const newGrid = [...grid];
        if (newGrid[row][col].isWall) {
          newGrid[row][col].isWall = false;
          setGrid(newGrid);
        }
        resetPaths();
      }
      return;
    }
    
    if (dragMode === 'move-end') {
      if (!isStart(row, col)) {
        setEndNode({ row, col });
        const newGrid = [...grid];
        if (newGrid[row][col].isWall) {
          newGrid[row][col].isWall = false;
          setGrid(newGrid);
        }
        resetPaths();
      }
      return;
    }

    if (isStart(row, col) || isEnd(row, col)) return;
    
    const newGrid = [...grid];
    const isCurrentlyWall = newGrid[row][col].isWall;
    
    if (dragMode === 'draw' && !isCurrentlyWall) {
      newGrid[row][col].isWall = true;
      setGrid(newGrid);
    } else if (dragMode === 'erase' && isCurrentlyWall) {
      newGrid[row][col].isWall = false;
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setDragMode(null);
  };

  const play = useCallback(() => {
    if (frames.length === 0 || done) {
      resetPaths();
      const f = ALGORITHMS[algo].fn(grid, startNode, endNode);
      setFrames(f);
      setFrameIdx(-1);
      setDone(false);
    }
    setPlaying(true);
  }, [frames.length, done, algo, grid, startNode, endNode, resetPaths]);

  useEffect(() => {
    if (playing) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setFrameIdx(prev => {
          const next = prev + 1;
          setTimerMs(t => t + Math.max(5, 100 - speed));
          if (next >= frames.length - 1) {
            clearInterval(timerRef.current);
            setPlaying(false);
            setDone(true);
            return frames.length - 1 > 0 ? frames.length - 1 : next;
          }
          return next;
        });
      }, Math.max(5, 100 - speed));
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed, frames.length]);

  const pause = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
  }, []);

  const currentFrame = frames[frameIdx] ?? {
    visited: new Set(),
    frontier: new Set(),
    current: null,
    path: []
  };

  const noPathFound = done && frames.length > 0 && frames[frames.length - 1].path.length === 0;

  const isStart = (r, c) => r === startNode.row && c === startNode.col;
  const isEnd = (r, c) => r === endNode.row && c === endNode.col;

  const getCellClass = (row, col) => {
    if (isStart(row, col)) return 'start';
    if (isEnd(row, col)) return 'end';
    if (grid[row][col].isWall) return 'wall';
    
    const id = `${row}-${col}`;
    if (currentFrame.path.includes(id)) return 'path';
    if (currentFrame.current === id) return 'current';
    if (currentFrame.frontier.has(id)) return 'frontier';
    if (currentFrame.visited.has(id)) return 'visited';
    
    return '';
  };

  return (
    <div className="grid-vis fade-in-up" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="grid-controls card">
        <div className="ctrl-row">
          <div className="segmented-control" style={{ overflowX: 'auto' }}>
            {Object.entries(ALGORITHMS).map(([key, v]) => (
              <button
                key={key}
                className={`segment-btn ${algo === key ? 'active' : ''}`}
                onClick={() => { setAlgo(key); resetPaths(); }}
                disabled={playing || drawingMaze}
              >
                {v.label}
              </button>
            ))}
          </div>
          
          <span className="ctrl-sep" />
          
          <div className="playback-btns">
            {!playing
              ? <button className="btn btn-primary btn-icon" onClick={play} disabled={(done && frames.length > 0) || drawingMaze} title="Play">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
              </button>
              : <button className="btn btn-ghost btn-icon" onClick={pause} title="Pause">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              </button>
            }
            <button className="btn btn-ghost btn-icon" onClick={resetPaths} disabled={playing || drawingMaze} title="Restart (Clear Path)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
              </svg>
            </button>
            <button className="btn btn-sm btn-ghost" onClick={clearBoard} disabled={playing || drawingMaze} style={{ marginLeft: '4px' }}>Clear Board</button>
          </div>
          
          <span className="ctrl-sep" />
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn btn-sm btn-ghost" onClick={() => generateMaze()} disabled={playing || drawingMaze}>Generate Maze</button>
          </div>
          
          <span className="ctrl-sep" />
          
          <div className="ctrl-group">
            <label>Speed <span className="mono">{speed}%</span></label>
            <input type="range" min={1} max={100} value={speed}
              onChange={e => setSpeed(+e.target.value)} />
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
        </div>
      </div>

      {showDesc && (
        <div className="card fade-in-up" style={{ marginBottom: '20px', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--neon-blue)', padding: '16px 20px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{ALGORITHMS[algo].label}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
            {ALGORITHMS[algo].desc}
          </p>
        </div>
      )}

      <div className={`grid-body ${showCode ? 'with-code' : ''}`}>
        <div className="grid-canvas card canvas-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', userSelect: 'none', margin: 0 }}>
              Click and drag to draw walls or move the Green (Start) and Red (Target) nodes.
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {(timerMs > 0 || playing) && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                  Time: {(timerMs / 1000).toFixed(2)}s
                </span>
              )}
              {noPathFound && (
                <span className="badge badge-red fade-in" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Path Not Found
                </span>
              )}
            </div>
          </div>
          <div className="grid-board">
            {grid.map((row, r) => (
              <div key={r} className="grid-row">
                {row.map((node, c) => (
                  <div
                    key={`${r}-${c}`}
                    id={`node-${r}-${c}`}
                    className={`grid-cell ${getCellClass(r, c)}`}
                    draggable={false}
                    onMouseDown={(e) => handleMouseDown(e, r, c)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    onMouseUp={handleMouseUp}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {showCode && (
          <div className="code-panel card fade-in-up">
            <div className="code-panel-header">
              <span className="code-panel-title">{ALGORITHMS[algo].label}</span>
            </div>
            <pre className="code-block">
              <code>{CODE_SNIPPETS[algo].cpp}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
