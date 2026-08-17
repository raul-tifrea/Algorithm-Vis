// Returns array of animation frames: [{array, comparing, swapped, sorted}]
export function bubbleSort(arr) {
  const frames = [];
  const a = [...arr];
  const n = a.length;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      frames.push({ array: [...a], comparing: [j, j + 1], swapped: [], sorted: [...sorted] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        frames.push({ array: [...a], comparing: [], swapped: [j, j + 1], sorted: [...sorted] });
      }
    }
    sorted.add(n - 1 - i);
  }
  sorted.add(0);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...sorted] });
  return frames;
}
