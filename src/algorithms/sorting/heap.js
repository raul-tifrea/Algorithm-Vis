export function heapSort(arr) {
  const frames = [];
  const a = [...arr];
  var n = a.length;
  var sorted = new Set();
  var temp;

  function heapify(arr, N, i) {
    var largest = i;
    var l = 2 * i + 1;
    var r = 2 * i + 2;

    frames.push({ array: [...arr], comparing: [i, l < N ? l : i], swapped: [], sorted: [...sorted] });

    if (l < N && arr[l] > arr[largest])
      largest = l;

    if (r < N && arr[r] > arr[largest])
      largest = r;

    if (largest !== i) {
      temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      frames.push({ array: [...arr], comparing: [], swapped: [i, largest], sorted: [...sorted] });
      heapify(arr, N, largest);
    }
  }

  for (var i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(a, n, i);

  for (var j = n - 1; j > 0; j--) {
    temp = a[0];
    a[0] = a[j];
    a[j] = temp;
    sorted.add(j);
    frames.push({ array: [...a], comparing: [], swapped: [0, j], sorted: [...sorted] });
    heapify(a, j, 0);
  }
  sorted.add(0);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...sorted] });
  return frames;
}
