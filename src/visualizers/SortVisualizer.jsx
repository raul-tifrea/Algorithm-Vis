import { useState, useEffect, useRef, useCallback } from 'react';
import { bubbleSort }    from '../algorithms/sorting/bubble';
import { selectionSort } from '../algorithms/sorting/selection';
import { insertionSort } from '../algorithms/sorting/insertion';
import { mergeSort }     from '../algorithms/sorting/merge';
import { quickSort }     from '../algorithms/sorting/quick';
import { heapSort }      from '../algorithms/sorting/heap';
import './SortVisualizer.css';

const CODE_SNIPPETS = {
  bubble: `function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {

      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {

        // Swap them if out of order
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
    // arr[n-1-i] is now in its final position
  }
  return arr;
}`,

  selection: `function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Find the minimum in the unsorted portion
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap minimum to its correct position
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,

  insertion: `function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let j = i;

    // Shift elements right until correct spot found
    while (j > 0 && arr[j] < arr[j - 1]) {
      [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
      j--;
    }
    // arr[j] is now in its sorted position
  }
  return arr;
}`,

  merge: `function mergeSort(arr, l = 0, r = arr.length - 1) {
  if (l >= r) return;

  const mid = Math.floor((l + r) / 2);

  mergeSort(arr, l, mid);       // Sort left half
  mergeSort(arr, mid + 1, r);   // Sort right half
  merge(arr, l, mid, r);        // Merge both halves
}

function merge(arr, l, mid, r) {
  const left  = arr.slice(l, mid + 1);
  const right = arr.slice(mid + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else                     arr[k++] = right[j++];
  }
  while (i < left.length)  arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,

  quick: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);   // Sort left of pivot
    quickSort(arr, pi + 1, high);  // Sort right of pivot
  }
}

function partition(arr, low, high) {
  const pivot = arr[high];  // Last element as pivot
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  // Place pivot in its correct position
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  return i + 1;
}`,

  heap: `function heapSort(arr) {
  const n = arr.length;

  // Build max-heap from unsorted array
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // Move root to end
    heapify(arr, i, 0);                  // Restore heap property
  }
}

function heapify(arr, n, i) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
};

const ALGORITHMS = {
  bubble:    { fn: bubbleSort,    label: 'Bubble Sort',    time: 'O(n²)',      space: 'O(1)',    stable: true  },
  selection: { fn: selectionSort, label: 'Selection Sort', time: 'O(n²)',      space: 'O(1)',    stable: false },
  insertion: { fn: insertionSort, label: 'Insertion Sort', time: 'O(n²)',      space: 'O(1)',    stable: true  },
  merge:     { fn: mergeSort,     label: 'Merge Sort',     time: 'O(n log n)', space: 'O(n)',    stable: true  },
  quick:     { fn: quickSort,     label: 'Quick Sort',     time: 'O(n log n)', space: 'O(log n)', stable: false },
  heap:      { fn: heapSort,      label: 'Heap Sort',      time: 'O(n log n)', space: 'O(1)',    stable: false },
};

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function getBarColor(i, frame) {
  if (!frame) return 'default';
  if (frame.sorted && frame.sorted.includes(i)) return 'sorted';
  if (frame.pivot === i)                         return 'pivot';
  if (frame.swapped && frame.swapped.includes(i)) return 'swapped';
  if (frame.comparing && frame.comparing.includes(i)) return 'comparing';
  return 'default';
}

function highlight(code) {
  const keywords = /\b(function|return|const|let|if|else|while|for|of|new|import|export|default)\b/g;
  const comments = /(\/\/[^\n]*)/g;
  const numbers  = /\b(\d+)\b/g;
  const strings  = /('[^']*'|"[^"]*"|`[^`]*`)/g;

  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(strings,  '<span class="tok-str">$1</span>')
    .replace(comments, '<span class="tok-comment">$1</span>')
    .replace(keywords, '<span class="tok-kw">$1</span>')
    .replace(numbers,  '<span class="tok-num">$1</span>');
}

export default function SortVisualizer() {
  const [algo, setAlgo]         = useState('bubble');
  const [size, setSize]         = useState(40);
  const [speed, setSpeed]       = useState(50);
  const [array, setArray]       = useState(() => randomArray(40));
  const [frames, setFrames]     = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying]   = useState(false);
  const [done, setDone]         = useState(false);
  const [showCode, setShowCode] = useState(true);
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
    let f = frames;
    let idx = frameIdx;
    if (frames.length === 0 || done) {
      f = ALGORITHMS[algo].fn(array);
      setFrames(f);
      idx = -1;
      setDone(false);
    }
    setPlaying(true);
    timerRef.current = setInterval(() => {
      idx++;
      setFrameIdx(idx);
      if (idx >= f.length - 1) {
        clearInterval(timerRef.current);
        setPlaying(false);
        setDone(true);
      }
    }, Math.max(10, 200 - speed * 1.8));
  }, [frames, frameIdx, algo, array, speed, done]);

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

  useEffect(() => () => clearInterval(timerRef.current), []);

  const algoInfo = ALGORITHMS[algo];

  const stepInfo = () => {
    if (!currentFrame) return 'Press Play or Step to start';
    if (currentFrame.sorted && currentFrame.sorted.length === displayArray.length) return 'Array sorted!';
    if (currentFrame.comparing?.length) return `Comparing indices ${currentFrame.comparing.join(' and ')}`;
    if (currentFrame.swapped?.length)   return `Swapping indices ${currentFrame.swapped.join(' and ')}`;
    if (currentFrame.pivot !== undefined && currentFrame.pivot >= 0) return `Pivot placed at index ${currentFrame.pivot}`;
    return 'Processing…';
  };

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
          <div className="ctrl-group">
            <label>Array Size <span className="mono">{size}</span></label>
            <input type="range" min={10} max={100} value={size}
              onChange={e => setSize(+e.target.value)} disabled={playing} />
          </div>
          <div className="ctrl-group">
            <label>Speed <span className="mono">{speed}%</span></label>
            <input type="range" min={1} max={100} value={speed}
              onChange={e => setSpeed(+e.target.value)} />
          </div>
        </div>
        <div className="ctrl-row">
          <button className="btn btn-ghost btn-sm" onClick={reset} disabled={playing}
            title="Randomize array">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            Randomize
          </button>
          <div className="playback-btns">
            {!playing
              ? <button className="btn btn-primary btn-icon" onClick={play} disabled={done && frames.length > 0} title="Play">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>
                </button>
              : <button className="btn btn-ghost btn-icon" onClick={pause} title="Pause">
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
          </div>
          <span className="ctrl-sep" />
          <button
            className={`btn btn-ghost btn-sm code-toggle ${showCode ? 'active' : ''}`}
            onClick={() => setShowCode(v => !v)}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
          <span className="mono step-info">{frameIdx >= 0 ? `Frame ${frameIdx + 1} / ${frames.length}` : 'Ready'}</span>
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
        <div className="card info-step">{stepInfo()}</div>
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
