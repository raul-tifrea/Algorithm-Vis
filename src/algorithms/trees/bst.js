function getNodes(tree, rootId) {
  var map = {};
  for (var i = 0; i < tree.length; i++) {
    map[tree[i].id] = tree[i];
  }
  return map;
}

export function bstSearch(tree, rootId, target) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];
  
  var curr = rootId;
  while (curr != null) {
    var node = map[curr];
    order.push(curr);
    frames.push({ highlighted: curr, order: [...order] });
    
    if (node.value === target) {
      frames.push({ highlighted: curr, order: [...order], found: true });
      break;
    } else if (target < node.value) {
      curr = node.left;
    } else {
      curr = node.right;
    }
  }
  
  if (curr == null) {
    frames.push({ highlighted: null, order: [...order], notFound: true });
  }

  return { frames, newTree: null };
}

export function bstInsert(tree, rootId, target) {
  var frames = [];
  var newTree = tree.map(n => ({ ...n }));
  var map = getNodes(newTree, rootId);
  var order = [];
  
  var curr = rootId;
  var parent = null;
  var side = null;
  var depth = 1;
  
  var newId = 'n' + Date.now();
  
  while (curr != null) {
    var node = map[curr];
    order.push(curr);
    frames.push({ highlighted: curr, order: [...order], hideNodes: [newId] });
    
    parent = curr;
    if (target < node.value) {
      curr = node.left;
      side = 'left';
    } else if (target > node.value) {
      curr = node.right;
      side = 'right';
    } else {
      frames.push({ highlighted: curr, order: [...order], found: true, error: "Value already exists!", hideNodes: [newId] });
      return { frames, newTree: null };
    }
    depth++;
  }
  
  if (depth > 4) {
    frames.push({ highlighted: parent, order: [...order], error: "Max depth of 4 reached!", hideNodes: [newId] });
    return { frames, newTree: null };
  }
  
  var newNode = { id: newId, value: target, left: null, right: null };
  newTree.push(newNode);
  map[parent][side] = newId;
  
  order.push(newId);
  frames.push({ highlighted: newId, order: [...order], hideNodes: [] });
  
  return { frames, newTree };
}
