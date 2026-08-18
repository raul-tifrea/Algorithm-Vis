export function quickSort(arr) {
  const frames = [];
  const a = [...arr];

  function partition(arr, low, high) {
    let pivot = arr[high];
    let i = (low - 1);
    let temp;

    for (let j = low; j <= high - 1; j++) {
      frames.push({ array: [...arr], comparing: [j, high], swapped: [], sorted: [], pivot: high });
      if (arr[j] < pivot) {
        i++;
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        if (i !== j) frames.push({ array: [...arr], comparing: [], swapped: [i, j], sorted: [], pivot: high });
      }
    }
    temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    frames.push({ array: [...arr], comparing: [], swapped: [i + 1, high], sorted: [], pivot: i + 1 });
    return (i + 1);
  }

  function sort(arr, low, high) {
    if (low < high) {
      let pi = partition(arr, low, high);
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    }
  }

  sort(a, 0, a.length - 1);
  frames.push({ array: [...a], comparing: [], swapped: [], sorted: [...new Array(a.length).keys()], pivot: -1 });
  return frames;
}
