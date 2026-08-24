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
    frames.push({ highlighted: curr, order: [...order], action: `Checking node ${node.value}` });
    
    if (node.value === target) {
      frames.push({ highlighted: curr, order: [...order], found: true, action: `Found target (${target}) at current node!` });
      break;
    } else if (target < node.value) {
      curr = node.left;
      frames.push({ highlighted: curr, order: [...order], action: `Target (${target}) < Current (${node.value}). Going left...` });
    } else {
      curr = node.right;
      frames.push({ highlighted: curr, order: [...order], action: `Target (${target}) > Current (${node.value}). Going right...` });
    }
  }
  
  if (curr == null) {
    frames.push({ highlighted: null, order: [...order], notFound: true, action: 'Target not found in tree' });
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
    frames.push({ highlighted: curr, order: [...order], hideNodes: [newId], action: `Checking node ${node.value}` });
    
    parent = curr;
    if (target < node.value) {
      curr = node.left;
      side = 'left';
      frames.push({ highlighted: curr, order: [...order], hideNodes: [newId], action: `New Value (${target}) < Current (${node.value}). Going left...` });
    } else if (target > node.value) {
      curr = node.right;
      side = 'right';
      frames.push({ highlighted: curr, order: [...order], hideNodes: [newId], action: `New Value (${target}) > Current (${node.value}). Going right...` });
    } else {
      frames.push({ highlighted: curr, order: [...order], found: true, error: "Value already exists!", hideNodes: [newId], action: `Value ${target} already exists in BST. Aborting insert.` });
      return { frames, newTree: null };
    }
    depth++;
  }
  
  if (depth > 4) {
    frames.push({ highlighted: parent, order: [...order], error: "Max depth of 4 reached!", hideNodes: [newId], action: 'Max depth of 4 reached, aborting insert' });
    return { frames, newTree: null };
  }
  
  var newNode = { id: newId, value: target, left: null, right: null };
  newTree.push(newNode);
  
  if (parent == null) {
    order.push(newId);
    frames.push({ highlighted: newId, order: [...order], hideNodes: [], action: `Inserted as new root node` });
    return { frames, newTree, newRootId: newId };
  }
  
  map[parent][side] = newId;
  order.push(newId);
  frames.push({ highlighted: newId, order: [...order], hideNodes: [], action: `Inserted new node as ${side} child` });
  
  return { frames, newTree };
}

export function bstDelete(tree, rootId, target) {
  var frames = [];
  var newTree = JSON.parse(JSON.stringify(tree)); 
  var map = getNodes(newTree, rootId);
  var order = [];
  
  var curr = rootId;
  var parent = null;
  var side = null;
  
  while (curr != null) {
    var node = map[curr];
    order.push(curr);
    frames.push({ highlighted: curr, order: [...order], action: `Checking node ${node.value}` });
    
    if (target === node.value) {
      break;
    }
    
    parent = curr;
    frames.push({ highlighted: curr, order: [...order], action: `parent = curr` });
    
    if (target < node.value) {
      curr = node.left;
      side = 'left';
      frames.push({ highlighted: curr, order: [...order], action: `curr = curr.left` });
    } else {
      curr = node.right;
      side = 'right';
      frames.push({ highlighted: curr, order: [...order], action: `curr = curr.right` });
    }
  }
  
  if (curr == null) {
    frames.push({ highlighted: null, order: [...order], error: "Value not found!", action: "Value not found!" });
    return { frames, newTree: null };
  }
  
  var nodeToDelete = map[curr];
  frames.push({ highlighted: curr, order: [...order], found: true, action: 'Node found!' });
  
  const removeNodeFromTree = (idToRemove) => {
    const idx = newTree.findIndex(n => n.id === idToRemove);
    if (idx !== -1) newTree.splice(idx, 1);
  };
  
  let newRootId = rootId;

  if (nodeToDelete.left == null || nodeToDelete.right == null) {
    var child = nodeToDelete.left != null ? nodeToDelete.left : nodeToDelete.right;
    
    if (parent == null) {
      newRootId = child; 
      frames.push({ highlighted: curr, order: [...order], action: 'Updating root pointer' });
    } else {
      map[parent][side] = child;
      frames.push({ highlighted: curr, order: [...order], action: `parent.${side} = curr.${child === nodeToDelete.left ? 'left' : (child === null ? 'next (null)' : 'right')}` });
    }
    removeNodeFromTree(curr);
    frames.push({ highlighted: child, order: [...order], deleted: curr, action: 'Node deleted and faded out' });
  } 
  
  else {
    var successorParent = curr;
    var successor = nodeToDelete.right;
    var succSide = 'right';
    
    order.push(successor);
    frames.push({ highlighted: successor, order: [...order], action: 'Node has 2 children. Finding inorder successor...' });
    
    while (map[successor].left != null) {
      successorParent = successor;
      frames.push({ highlighted: successor, order: [...order], action: 'successorParent = successor' });
      
      succSide = 'left';
      successor = map[successor].left;
      order.push(successor);
      frames.push({ highlighted: successor, order: [...order], action: 'successor = successor.left' });
    }
    
    var succNode = map[successor];
    frames.push({ highlighted: successor, order: [...order], action: 'Inorder successor found!' });
    
    var succChild = succNode.right;
    if (successorParent === curr) {
      map[successorParent].right = succChild;
      frames.push({ highlighted: curr, order: [...order], action: 'successorParent.right = successor.right' });
    } else {
      map[successorParent].left = succChild;
      frames.push({ highlighted: curr, order: [...order], action: 'successorParent.left = successor.right' });
    }

    succNode.left = nodeToDelete.left;
    succNode.right = nodeToDelete.right;
    
    if (parent == null) {
      newRootId = successor;
      frames.push({ highlighted: curr, order: [...order], action: 'Root updated to successor' });
    } else {
      map[parent][side] = successor;
      frames.push({ highlighted: curr, order: [...order], action: `parent.${side} = successor` });
    }
    
    removeNodeFromTree(curr);
    
    frames.push({ 
      highlighted: successor, 
      order: [...order], 
      deleted: curr,
      action: 'Target node physically replaced by successor and faded out'
    });
  }
  
  return { frames, newTree, newRootId };
}
