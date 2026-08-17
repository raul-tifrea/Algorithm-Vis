export function selectionSort(arr) {
  const frames = [];
  const a = [...arr];
  const n = a.length;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      frames.push({ array: [...a], comparing: [minIdx, j], swapped: [], sorted: [...sorted] });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      frames.push({ array: [...a], comparing: [], swapped: [i, minIdx], sorted: [...sorted] });
    }
    sorted.add(i);
  }
  sorted.add(n - 1);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...sorted] });
  return frames;
}
