export function quickSort(arr) {
  const frames = [];
  const a = [...arr];

  function partition(a, low, high) {
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      frames.push({ array: [...a], comparing: [j, high], swapped: [], sorted: [], pivot: high });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j) frames.push({ array: [...a], comparing: [], swapped: [i, j], sorted: [], pivot: high });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    frames.push({ array: [...a], comparing: [], swapped: [i + 1, high], sorted: [], pivot: i + 1 });
    return i + 1;
  }

  function sort(a, low, high) {
    if (low < high) {
      const pi = partition(a, low, high);
      sort(a, low, pi - 1);
      sort(a, pi + 1, high);
    }
  }

  sort(a, 0, a.length - 1);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...new Array(a.length).keys()], pivot: -1 });
  return frames;
}
