
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

  function inorder(nodeId) {
    if (nodeId == null || !map[nodeId]) return;
    
    inorder(map[nodeId].left);
    
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order] });
    
    inorder(map[nodeId].right);
  }
  
  inorder(rootId);
  return frames;
}

export function preorderTraversal(tree, rootId) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];

  function preorder(nodeId) {
    if (nodeId == null || !map[nodeId]) return;
    
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order] });
    
    preorder(map[nodeId].left);
    preorder(map[nodeId].right);
  }
  
  preorder(rootId);
  return frames;
}

export function postorderTraversal(tree, rootId) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];

  function postorder(nodeId) {
    if (nodeId == null || !map[nodeId]) return;
    
    postorder(map[nodeId].left);
    postorder(map[nodeId].right);
    
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order] });
  }
  
  postorder(rootId);
  return frames;
}

export function levelorderTraversal(tree, rootId) {
  var frames = [];
  var map = getNodes(tree, rootId);
  var order = [];
  var queue = [];
  var nodeId;

  queue.push(rootId);

  while (queue.length > 0) {
    nodeId = queue.shift();
    if (nodeId == null || !map[nodeId]) continue;
    
    order.push(nodeId);
    frames.push({ highlighted: nodeId, order: [...order] });
    
    if (map[nodeId].left != null) queue.push(map[nodeId].left);
    if (map[nodeId].right != null) queue.push(map[nodeId].right);
  }
  return frames;
}
