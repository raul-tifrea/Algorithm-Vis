export function mergeSort(arr) {
  const frames = [];
  const a = [...arr];

  function merge(arr, l, m, r) {
    var n1 = m - l + 1;
    var n2 = r - m;

    var L = new Array(n1);
    var R = new Array(n2);

    for (var i = 0; i < n1; i++) L[i] = arr[l + i];
    for (var j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    var i = 0;
    var j = 0;
    var k = l;

    while (i < n1 && j < n2) {
      frames.push({ array: [...arr], comparing: [l + i, m + 1 + j], swapped: [], sorted: [] });
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      frames.push({ array: [...arr], comparing: [], swapped: [k], sorted: [] });
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      frames.push({ array: [...arr], comparing: [], swapped: [k], sorted: [] });
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      frames.push({ array: [...arr], comparing: [], swapped: [k], sorted: [] });
      j++;
      k++;
    }
  }

  function sort(arr, l, r) {
    if (l >= r) {
      return;
    }
    var m = l + parseInt((r - l) / 2);
    sort(arr, l, m);
    sort(arr, m + 1, r);
    merge(arr, l, m, r);
  }

  sort(a, 0, a.length - 1);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...new Array(a.length).keys()] });
  return frames;
}
