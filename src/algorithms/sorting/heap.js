export function heapSort(arr) {
  const frames = [];
  const a = [...arr];
  const n = a.length;

  function heapify(a, n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    frames.push({ array: [...a], comparing: [i, l < n ? l : i], swapped: [], sorted: [] });
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      frames.push({ array: [...a], comparing: [], swapped: [i, largest], sorted: [] });
      heapify(a, n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);

  const sorted = new Set();
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    frames.push({ array: [...a], comparing: [], swapped: [0, i], sorted: [...sorted] });
    heapify(a, i, 0);
  }
  sorted.add(0);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...sorted] });
  return frames;
}
