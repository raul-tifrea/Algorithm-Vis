export function selectionSort(arr) {
  const frames = [];
  const a = [...arr];
  var n = a.length;
  var i, j, min_idx, temp;
  var sorted = new Set();

  for (i = 0; i < n - 1; i++) {
    min_idx = i;
    for (j = i + 1; j < n; j++) {
      frames.push({ array: [...a], comparing: [min_idx, j], swapped: [], sorted: [...sorted] });
      if (a[j] < a[min_idx]) {
        min_idx = j;
      }
    }
    if (min_idx !== i) {
      temp = a[i];
      a[i] = a[min_idx];
      a[min_idx] = temp;
      frames.push({ array: [...a], comparing: [], swapped: [i, min_idx], sorted: [...sorted] });
    }
    sorted.add(i);
  }
  sorted.add(n - 1);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...sorted] });
  return frames;
}
