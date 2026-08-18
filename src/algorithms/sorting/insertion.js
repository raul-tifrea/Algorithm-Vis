export function insertionSort(arr) {
  const frames = [];
  const a = [...arr];
  var n = a.length;
  var i, key, j;
  var sorted = new Set([0]);

  for (i = 1; i < n; i++) {
    key = a[i];
    j = i - 1;

    while (j >= 0 && a[j] > key) {
      frames.push({ array: [...a], comparing: [j, j + 1], swapped: [], sorted: [...sorted] });
      a[j + 1] = a[j];
      frames.push({ array: [...a], comparing: [], swapped: [j, j + 1], sorted: [...sorted] });
      j = j - 1;
    }
    a[j + 1] = key;
    sorted.add(i);
  }
  
  for (let k = 0; k < n; k++) sorted.add(k);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...sorted] });
  return frames;
}
