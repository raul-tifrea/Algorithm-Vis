import { useState, useEffect, useRef, useCallback } from 'react';
import { bubbleSort } from '../algorithms/sorting/bubble';
import { selectionSort } from '../algorithms/sorting/selection';
import { insertionSort } from '../algorithms/sorting/insertion';
import { mergeSort } from '../algorithms/sorting/merge';
import { quickSort } from '../algorithms/sorting/quick';
import { heapSort } from '../algorithms/sorting/heap';
import './SortVisualizer.css';

const CODE_SNIPPETS = {
  bubble: {
    javascript: `function bubbleSort(arr) {
  let swapped = true;
  // Repeat until no more swaps are needed
  while (swapped) {
    swapped = false;
    // Compare adjacent elements
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap if left element is larger
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  }
  return arr;
}`,
    python: `def bubble_sort(arr):
    swapped = True
    # Repeat until no more swaps are needed
    while swapped:
        swapped = False
        # Compare adjacent elements
        for i in range(len(arr) - 1):
            if arr[i] > arr[i + 1]:
                # Swap if left element is larger
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True
    return arr`,
    java: `public static void bubbleSort(int[] arr) {
    boolean swapped = true;
    // Repeat until no more swaps are needed
    while (swapped) {
        swapped = false;
        // Compare adjacent elements
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                // Swap if left element is larger
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
    }
}`,
    cpp: `void bubbleSort(std::vector<int>& arr) {
    bool swapped = true;
    // Repeat until no more swaps are needed
    while (swapped) {
        swapped = false;
        // Compare adjacent elements
        for (size_t i = 0; i < arr.size() - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                // Swap if left element is larger
                std::swap(arr[i], arr[i + 1]);
                swapped = true;
            }
        }
    }
}`
  },
  selection: {
    javascript: `function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    // Assume current index is the minimum
    let min = i;
    // Find the actual minimum in the remaining array
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    // Swap the minimum element to its correct position
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
}`,
    python: `def selection_sort(arr):
    for i in range(len(arr)):
        # Assume current index is the minimum
        min_idx = i
        # Find the actual minimum in the remaining array
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Swap the minimum element to its correct position
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    java: `public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        // Assume current index is the minimum
        int min = i;
        // Find the actual minimum in the remaining array
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) min = j;
        }
        // Swap the minimum element to its correct position
        int temp = arr[i];
        arr[i] = arr[min];
        arr[min] = temp;
    }
}`,
    cpp: `void selectionSort(std::vector<int>& arr) {
    for (size_t i = 0; i < arr.size(); i++) {
        // Assume current index is the minimum
        size_t min = i;
        // Find the actual minimum in the remaining array
        for (size_t j = i + 1; j < arr.size(); j++) {
            if (arr[j] < arr[min]) min = j;
        }
        // Swap the minimum element to its correct position
        std::swap(arr[i], arr[min]);
    }
}`
  },
  insertion: {
    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    // Shift elements of the sorted segment to the right
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    // Insert the current element into its correct position
    arr[j + 1] = current;
  }
  return arr;
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        current = arr[i]
        j = i - 1
        # Shift elements of the sorted segment to the right
        while j >= 0 and arr[j] > current:
            arr[j + 1] = arr[j]
            j -= 1
        # Insert the current element into its correct position
        arr[j + 1] = current
    return arr`,
    java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int current = arr[i];
        int j = i - 1;
        // Shift elements of the sorted segment to the right
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        // Insert the current element into its correct position
        arr[j + 1] = current;
    }
}`,
    cpp: `void insertionSort(std::vector<int>& arr) {
    for (size_t i = 1; i < arr.size(); i++) {
        int current = arr[i];
        int j = i - 1;
        // Shift elements of the sorted segment to the right
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        // Insert the current element into its correct position
        arr[j + 1] = current;
    }
}`
  },
  merge: {
    javascript: `function mergeSort(arr) {
  // Base case: array of size 1 is already sorted
  if (arr.length <= 1) return arr;
  
  // Split array in half
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  
  // Merge the two sorted halves back together
  let result = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) result.push(left.shift());
    else result.push(right.shift());
  }
  return [...result, ...left, ...right];
}`,
    python: `def merge_sort(arr):
    # Base case: array of size 1 is already sorted
    if len(arr) <= 1:
        return arr
    
    # Split array in half
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge the two sorted halves back together
    result = []
    while left and right:
        if left[0] < right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    return result + left + right`,
    java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        // Find the middle point
        int m = l + (r - l) / 2;
        
        // Sort first and second halves
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        
        // Merge the sorted halves
        merge(arr, l, m, r);
    }
}`,
    cpp: `void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l < r) {
        // Find the middle point
        int m = l + (r - l) / 2;
        
        // Sort first and second halves
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        
        // Merge the sorted halves
        merge(arr, l, m, r);
    }
}`
  },
  quick: {
    javascript: `function quickSort(arr) {
  // Base case: array of size 1 is already sorted
  if (arr.length <= 1) return arr;
  
  // Choose the last element as the pivot
  let pivot = arr[arr.length - 1];
  let left = [], right = [];
  
  // Partition array around the pivot
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  
  // Recursively sort and combine
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    python: `def quick_sort(arr):
    # Base case: array of size 1 is already sorted
    if len(arr) <= 1:
        return arr
        
    # Choose the last element as the pivot
    pivot = arr[-1]
    
    # Partition array around the pivot
    left = [x for x in arr[:-1] if x < pivot]
    right = [x for x in arr[:-1] if x >= pivot]
    
    # Recursively sort and combine
    return quick_sort(left) + [pivot] + quick_sort(right)`,
    java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // Partition array and get the pivot index
        int pi = partition(arr, low, high);
        
        // Recursively sort elements before and after pivot
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    cpp: `void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        // Partition array and get the pivot index
        int pi = partition(arr, low, high);
        
        // Recursively sort elements before and after pivot
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
  },
  heap: {
    javascript: `function heapSort(arr) {
  // Build max heap from the array
  for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
    heapify(arr, arr.length, i);
  }
  
  // Extract elements one by one
  for (let i = arr.length - 1; i > 0; i--) {
    // Move current root to end
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    
    // Call max heapify on the reduced heap
    heapify(arr, i, 0);
  }
  return arr;
}`,
    python: `def heap_sort(arr):
    n = len(arr)
    # Build max heap from the array
    for i in range(n // 2, -1, -1):
        heapify(arr, n, i)
        
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        # Move current root to end
        arr[i], arr[0] = arr[0], arr[i]
        
        # Call max heapify on the reduced heap
        heapify(arr, i, 0)
    return arr`,
    java: `public static void heapSort(int[] arr) {
    int n = arr.length;
    // Build max heap from the array
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
        
    // Extract elements one by one
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}`,
    cpp: `void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    // Build max heap from the array
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
        
    // Extract elements one by one
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        std::swap(arr[0], arr[i]);
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}`
  }
};

const ALGORITHMS = {
  bubble: { fn: bubbleSort, label: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', stable: true, desc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Passes through the list are repeated until the list is sorted. It is a simple algorithm but very inefficient for large datasets.' },
  selection: { fn: selectionSort, label: 'Selection Sort', time: 'O(n²)', space: 'O(1)', stable: false, desc: 'Divides the input list into two parts: a sorted sublist and an unsorted sublist. Repeatedly selects the smallest element from the unsorted sublist and moves it to the end of the sorted sublist. It performs well on small lists but poorly on large ones.' },
  insertion: { fn: insertionSort, label: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', stable: true, desc: 'Builds the final sorted array one item at a time. It iterates through the input elements, growing a sorted array behind it by repeatedly taking the next element and inserting it into its proper place within the already sorted part.' },
  merge: { fn: mergeSort, label: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', stable: true, desc: 'A divide and conquer algorithm that divides the input array into two equal halves, calls itself recursively for the two halves, and then merges the two sorted halves back together in linear time.' },
  quick: { fn: quickSort, label: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)', stable: false, desc: 'A highly efficient divide and conquer algorithm. It picks an element as a "pivot" and partitions the given array around the picked pivot, placing smaller elements to the left and larger to the right, then recursively sorts the sub-arrays.' },
  heap: { fn: heapSort, label: 'Heap Sort', time: 'O(n log n)', space: 'O(1)', stable: false, desc: 'A comparison-based sorting technique based on a Binary Heap data structure. It divides its input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region.' },
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

export default function SortVisualizer() {
  const [algo, setAlgo] = useState('bubble');
  const [codeLang, setCodeLang] = useState('javascript');
  const [size, setSize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState(() => randomArray(30));
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
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
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{algoInfo.label}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
            {algoInfo.desc}
          </p>
        </div>
      )}

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="code-panel-title">{algoInfo.label}</span>
                <span className="badge badge-blue mono">{algoInfo.time}</span>
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
