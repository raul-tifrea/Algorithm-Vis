import { useState, useEffect, useRef, useCallback } from 'react';
import { bubbleSort } from '../algorithms/sorting/bubble';
import { selectionSort } from '../algorithms/sorting/selection';
import { insertionSort } from '../algorithms/sorting/insertion';
import { mergeSort } from '../algorithms/sorting/merge';
import { quickSort } from '../algorithms/sorting/quick';
import { heapSort } from '../algorithms/sorting/heap';
import './SortVisualizer.css';

const CODE_SNIPPETS = {
  bubble: `function bubbleSort(arr) {
  let swapped = true;
  
  while (swapped) {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap if left is bigger than right
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  }
  return arr;
}`,

  selection: `function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    
    // Find the smallest number's index
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    
    // Swap it to the front
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
}`,

  insertion: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    
    // Move bigger numbers to the right
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert the number in the correct spot
    arr[j + 1] = current;
  }
  return arr;
}`,

  merge: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  // Split array in half
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  
  // Merge the sorted halves
  let result = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) result.push(left.shift());
    else result.push(right.shift());
  }
  return [...result, ...left, ...right];
}`,

  quick: `function quickSort(arr) {
  if (arr.length <= 1) return arr;

  let pivot = arr[arr.length - 1];
  let left = [], right = [];

  // Sort numbers into left (smaller) and right (bigger)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  // Combine them back together
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,

  heap: `function heapSort(arr) {
  // 1. Build a Max Heap
  for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
    heapify(arr, arr.length, i);
  }

  // 2. Extract biggest numbers one by one
  for (let i = arr.length - 1; i > 0; i--) {
    // Swap the biggest number to the end
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    
    // Fix the heap
    heapify(arr, i, 0);
  }
  return arr;
}`
};

const ALGORITHMS = {
  bubble: { fn: bubbleSort, label: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', stable: true },
  selection: { fn: selectionSort, label: 'Selection Sort', time: 'O(n²)', space: 'O(1)', stable: false },
  insertion: { fn: insertionSort, label: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', stable: true },
  merge: { fn: mergeSort, label: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', stable: true },
  quick: { fn: quickSort, label: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)', stable: false },
  heap: { fn: heapSort, label: 'Heap Sort', time: 'O(n log n)', space: 'O(1)', stable: false },
};

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function getBarColor(i, frame) {
  if (!frame) return 'default';
  if (frame.sorted && frame.sorted.includes(i)) return 'sorted';
  if (frame.pivot === i) return 'pivot';
  if (frame.swapped && frame.swapped.includes(i)) return 'swapped';
  if (frame.comparing && frame.comparing.includes(i)) return 'comparing';
  return 'default';
}

function highlight(code) {
  const keywords = /\b(function|return|const|let|if|else|while|for|of|new|import|export|default)\b/g;
  const comments = /(\/\/[^\n]*)/g;
  const numbers = /\b(\d+)\b/g;
  const strings = /('[^']*'|"[^"]*"|`[^`]*`)/g;

  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(strings, '<span class="tok-str">$1</span>')
    .replace(comments, '<span class="tok-comment">$1</span>')
    .replace(keywords, '<span class="tok-kw">$1</span>')
    .replace(numbers, '<span class="tok-num">$1</span>');
}

export default function SortVisualizer() {
  const [algo, setAlgo] = useState('bubble');
  const [size, setSize] = useState(20);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState(() => randomArray(20));
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const timerRef = useRef(null);

  const currentFrame = frames[frameIdx] ?? null;
  const displayArray = currentFrame ? currentFrame.array : array;

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    const arr = randomArray(size);
    setArray(arr);
    setFrames([]);
    setFrameIdx(-1);
    setPlaying(false);
    setDone(false);
  }, [size]);

  useEffect(() => { reset(); }, [size]);

  const play = useCallback(() => {
    if (frames.length === 0 || done) {
      const f = ALGORITHMS[algo].fn(array);
      setFrames(f);
      setFrameIdx(-1);
      setDone(false);
    }
    setPlaying(true);
  }, [frames.length, done, algo, array]);

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
      }, Math.max(10, 200 - speed * 1.8));
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed, frames.length]);

  const pause = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
  }, []);

  const step = useCallback(() => {
    let f = frames;
    if (f.length === 0) {
      f = ALGORITHMS[algo].fn(array);
      setFrames(f);
    }
    setFrameIdx(i => {
      const next = Math.min(i + 1, f.length - 1);
      if (next === f.length - 1) setDone(true);
      return next;
    });
  }, [frames, algo, array]);

  const stepBack = useCallback(() => {
    setFrameIdx(i => {
      const prev = Math.max(0, i - 1);
      if (i === frames.length - 1) setDone(false);
      return prev;
    });
  }, [frames]);



  const algoInfo = ALGORITHMS[algo];


  return (
    <div className="sort-vis fade-in-up">
      <div className="sort-controls card">
        <div className="ctrl-row">
          <div className="ctrl-group">
            <label>Algorithm</label>
            <select value={algo} onChange={e => { setAlgo(e.target.value); reset(); }} disabled={playing}>
              {Object.entries(ALGORITHMS).map(([key, v]) => (
                <option key={key} value={key}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="ctrl-group" style={{ marginLeft: '12px' }}>
            <label>Array Size <span className="mono">{size}</span></label>
            <input type="range" min={10} max={100} value={size}
              onChange={e => setSize(+e.target.value)} disabled={playing} />
          </div>
          <div className="ctrl-group" style={{ marginLeft: '12px' }}>
            <label>Speed <span className="mono">{speed}%</span></label>
            <input type="range" min={1} max={100} value={speed}
              onChange={e => setSpeed(+e.target.value)} />
          </div>
          <button className="btn btn-ghost btn-icon" onClick={reset} disabled={playing}
            title="Randomize array" style={{ marginLeft: '12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
            </svg>
          </button>
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
          </div>
          <span className="ctrl-sep" />
          <button
            className={`btn btn-ghost btn-sm code-toggle ${showCode ? 'active' : ''}`}
            onClick={() => setShowCode(v => !v)}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
      </div>

      <div className={`sort-body ${showCode ? 'with-code' : ''}`}>
        <div className="sort-canvas card">
          <div className="bars-container">
            {displayArray.map((val, i) => (
              <div
                key={i}
                className={`bar bar-${getBarColor(i, currentFrame)}`}
                style={{ height: `${val}%` }}
                title={val}
              >
                {size <= 40 && <span className="bar-label">{val}</span>}
              </div>
            ))}
          </div>
        </div>

        {showCode && (
          <div className="code-panel card">
            <div className="code-panel-header">
              <span className="code-panel-title">{algoInfo.label}</span>
              <span className="badge badge-blue mono">{algoInfo.time}</span>
            </div>
            <pre
              className="code-block"
              dangerouslySetInnerHTML={{ __html: highlight(CODE_SNIPPETS[algo]) }}
            />
          </div>
        )}
      </div>

      <div className="sort-info">
        <div className="card info-complexity">
          <h3>Complexity</h3>
          <table>
            <tbody>
              <tr>
                <td>Time</td>
                <td><span className="mono badge badge-blue">{algoInfo.time}</span></td>
              </tr>
              <tr>
                <td>Space</td>
                <td><span className="mono badge badge-purple">{algoInfo.space}</span></td>
              </tr>
              <tr>
                <td>Stable</td>
                <td><span className={`badge ${algoInfo.stable ? 'badge-green' : 'badge-yellow'}`}>{algoInfo.stable ? 'Yes' : 'No'}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card info-legend">
          <h3>Legend</h3>
          <div className="legend-items">
            <div className="legend-item"><span className="legend-dot default" />Default</div>
            <div className="legend-item"><span className="legend-dot comparing" />Comparing</div>
            <div className="legend-item"><span className="legend-dot swapped" />Swapping</div>
            <div className="legend-item"><span className="legend-dot pivot" />Pivot</div>
            <div className="legend-item"><span className="legend-dot sorted" />Sorted</div>
          </div>
        </div>
      </div>
    </div>
  );
}
