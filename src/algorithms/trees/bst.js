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

export function bstDelete(tree, rootId, target) {
  var frames = [];
  var newTree = JSON.parse(JSON.stringify(tree)); // Deep copy to safely modify references
  var map = getNodes(newTree, rootId);
  var order = [];
  
  var curr = rootId;
  var parent = null;
  var side = null;
  
  while (curr != null) {
    var node = map[curr];
    order.push(curr);
    frames.push({ highlighted: curr, order: [...order], operation: 'searching' });
    
    if (target === node.value) {
      break;
    }
    
    parent = curr;
    if (target < node.value) {
      curr = node.left;
      side = 'left';
    } else {
      curr = node.right;
      side = 'right';
    }
  }
  
  if (curr == null) {
    frames.push({ highlighted: null, order: [...order], error: "Value not found!" });
    return { frames, newTree: null };
  }
  
  var nodeToDelete = map[curr];
  frames.push({ highlighted: curr, order: [...order], found: true, operation: 'found' });
  
  const removeNodeFromTree = (idToRemove) => {
    const idx = newTree.findIndex(n => n.id === idToRemove);
    if (idx !== -1) newTree.splice(idx, 1);
  };
  
  let newRootId = rootId;

  // Case 1: Leaf node OR Case 2: One child
  if (nodeToDelete.left == null || nodeToDelete.right == null) {
    var child = nodeToDelete.left != null ? nodeToDelete.left : nodeToDelete.right;
    
    if (parent == null) {
      newRootId = child; 
    } else {
      map[parent][side] = child;
    }
    removeNodeFromTree(curr);
    frames.push({ highlighted: child, order: [...order], deleted: curr });
  } 
  // Case 3: Two children (find inorder successor)
  else {
    var successorParent = curr;
    var successor = nodeToDelete.right;
    var succSide = 'right';
    
    order.push(successor);
    frames.push({ highlighted: successor, order: [...order], operation: 'finding_successor' });
    
    while (map[successor].left != null) {
      successorParent = successor;
      succSide = 'left';
      successor = map[successor].left;
      order.push(successor);
      frames.push({ highlighted: successor, order: [...order], operation: 'finding_successor' });
    }
    
    var succNode = map[successor];
    frames.push({ highlighted: successor, order: [...order], operation: 'copying_value' });
    
    nodeToDelete.value = succNode.value;
    frames.push({ 
      highlighted: curr, 
      order: [...order], 
      operation: 'value_copied',
      overrideValues: { [curr]: succNode.value }
    });
    
    var succChild = succNode.right;
    if (successorParent === curr) {
      map[successorParent].right = succChild;
    } else {
      map[successorParent].left = succChild;
    }
    removeNodeFromTree(successor);
    
    frames.push({ 
      highlighted: curr, 
      order: [...order], 
      deleted: successor,
      overrideValues: { [curr]: succNode.value }
    });
  }
  
  return { frames, newTree, newRootId };
}
