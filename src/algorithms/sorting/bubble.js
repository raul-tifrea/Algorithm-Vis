export function bubbleSort(arr) {
  const frames = [];
  const a = [...arr];
  var n = a.length;
  var i, j, temp;
  var swapped;
  var sorted = new Set();

  for (i = 0; i < n - 1; i++) {
    swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      frames.push({ array: [...a], comparing: [j, j + 1], swapped: [], sorted: [...sorted] });
      if (a[j] > a[j + 1]) {
        temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;
        frames.push({ array: [...a], comparing: [], swapped: [j, j + 1], sorted: [...sorted] });
      }
    }
    sorted.add(n - 1 - i);
    if (swapped === false) {
      break;
    }
  }
  
  for (let k = 0; k < n; k++) sorted.add(k);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...sorted] });
  return frames;
}
