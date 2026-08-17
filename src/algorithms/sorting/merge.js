export function mergeSort(arr) {
  const frames = [];
  const a = [...arr];

  function merge(a, l, m, r) {
    const left  = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      frames.push({ array: [...a], comparing: [l + i, m + 1 + j], swapped: [], sorted: [] });
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else                     { a[k++] = right[j++]; }
      frames.push({ array: [...a], comparing: [], swapped: [k - 1], sorted: [] });
    }
    while (i < left.length) { a[k++] = left[i++]; frames.push({ array: [...a], comparing: [], swapped: [k-1], sorted: [] }); }
    while (j < right.length){ a[k++] = right[j++]; frames.push({ array: [...a], comparing: [], swapped: [k-1], sorted: [] }); }
  }

  function sort(a, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    sort(a, l, m);
    sort(a, m + 1, r);
    merge(a, l, m, r);
  }

  sort(a, 0, a.length - 1);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...new Array(a.length).keys()] });
  return frames;
}
