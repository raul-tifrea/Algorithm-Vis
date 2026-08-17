export function insertionSort(arr) {
  const frames = [];
  const a = [...arr];
  const n = a.length;
  const sorted = new Set([0]);

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      frames.push({ array: [...a], comparing: [j - 1, j], swapped: [], sorted: [...sorted] });
      if (a[j] < a[j - 1]) {
        [a[j], a[j - 1]] = [a[j - 1], a[j]];
        frames.push({ array: [...a], comparing: [], swapped: [j - 1, j], sorted: [...sorted] });
        j--;
      } else break;
    }
    sorted.add(i);
  }
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...new Array(a.length).keys()] });
  return frames;
}
