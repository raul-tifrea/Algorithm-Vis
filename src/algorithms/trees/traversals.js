
function getNodes(tree, rootId) {
  var map = {};
  for (var i = 0; i < tree.length; i++) {
    map[tree[i].id] = tree[i];
  }
  return map;
}

export function inorderTraversal(tree, rootId) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];

  function inorder(nodeId, parentId = null, side = '') {
    if (nodeId == null || !map[nodeId]) {
      if (parentId) frames.push({ highlighted: parentId, order: [...order], action: `Base case: ${side} child is null, returning.` });
      return;
    }
    
    const val = map[nodeId].value;
    frames.push({ highlighted: nodeId, order: [...order], action: `At Node (${val}). 1. Traversing left subtree...` });
    inorder(map[nodeId].left, nodeId, 'left');
    
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order], action: `Returned from left. 2. Processing Node (${val})!` });
    
    frames.push({ highlighted: nodeId, order: [...order], action: `At Node (${val}). 3. Traversing right subtree...` });
    inorder(map[nodeId].right, nodeId, 'right');
    
    frames.push({ highlighted: nodeId, order: [...order], action: `Returned from right. Finished with Node (${val}).` });
  }
  
  frames.push({ highlighted: null, order: [], action: `Starting In-Order Traversal (Left, Root, Right)...` });
  inorder(rootId);
  frames.push({ highlighted: null, order: [...order], action: `In-Order Traversal Complete!` });
  return frames;
}

export function preorderTraversal(tree, rootId) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];

  function preorder(nodeId, parentId = null, side = '') {
    if (nodeId == null || !map[nodeId]) {
      if (parentId) frames.push({ highlighted: parentId, order: [...order], action: `Base case: ${side} child is null, returning.` });
      return;
    }
    
    const val = map[nodeId].value;
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order], action: `At Node (${val}). 1. Processing Node (${val})!` });
    
    frames.push({ highlighted: nodeId, order: [...order], action: `At Node (${val}). 2. Traversing left subtree...` });
    preorder(map[nodeId].left, nodeId, 'left');
    
    frames.push({ highlighted: nodeId, order: [...order], action: `At Node (${val}). 3. Traversing right subtree...` });
    preorder(map[nodeId].right, nodeId, 'right');
    
    frames.push({ highlighted: nodeId, order: [...order], action: `Finished with Node (${val}).` });
  }
  
  frames.push({ highlighted: null, order: [], action: `Starting Pre-Order Traversal (Root, Left, Right)...` });
  preorder(rootId);
  frames.push({ highlighted: null, order: [...order], action: `Pre-Order Traversal Complete!` });
  return frames;
}

export function postorderTraversal(tree, rootId) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];

  function postorder(nodeId, parentId = null, side = '') {
    if (nodeId == null || !map[nodeId]) {
      if (parentId) frames.push({ highlighted: parentId, order: [...order], action: `Base case: ${side} child is null, returning.` });
      return;
    }
    
    const val = map[nodeId].value;
    frames.push({ highlighted: nodeId, order: [...order], action: `At Node (${val}). 1. Traversing left subtree...` });
    postorder(map[nodeId].left, nodeId, 'left');
    
    frames.push({ highlighted: nodeId, order: [...order], action: `At Node (${val}). 2. Traversing right subtree...` });
    postorder(map[nodeId].right, nodeId, 'right');
    
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order], action: `Returned from both sides. 3. Processing Node (${val})!` });
  }
  
  frames.push({ highlighted: null, order: [], action: `Starting Post-Order Traversal (Left, Right, Root)...` });
  postorder(rootId);
  frames.push({ highlighted: null, order: [...order], action: `Post-Order Traversal Complete!` });
  return frames;
}

export function levelorderTraversal(tree, rootId) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];
  var queue = [];
  var nodeId;

  frames.push({ highlighted: null, order: [], action: `Starting Level-Order (BFS) Traversal...` });
  queue.push(rootId);
  frames.push({ highlighted: rootId, order: [], action: `Enqueued root node (${map[rootId].value})` });

  while (queue.length > 0) {
    nodeId = queue.shift();
    if (nodeId == null || !map[nodeId]) continue;
    
    const val = map[nodeId].value;
    frames.push({ highlighted: nodeId, order: [...order], action: `Dequeued Node (${val}). Processing...` });
    
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order], action: `Processed Node (${val})!` });
    
    if (map[nodeId].left != null) {
      queue.push(map[nodeId].left);
      frames.push({ highlighted: nodeId, order: [...order], action: `Enqueued left child (${map[map[nodeId].left].value})` });
    }
    if (map[nodeId].right != null) {
      queue.push(map[nodeId].right);
      frames.push({ highlighted: nodeId, order: [...order], action: `Enqueued right child (${map[map[nodeId].right].value})` });
    }
  }
  
  frames.push({ highlighted: null, order: [...order], action: `Level-Order Traversal Complete!` });
  return frames;
}
