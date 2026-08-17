// Tree node: { id, value, left: id|null, right: id|null }
// Returns frames: { highlighted: id[], order: id[] }

function getNodes(tree, rootId) {
  const map = {};
  for (const node of tree) map[node.id] = node;
  return map;
}

export function inorderTraversal(tree, rootId) {
  const frames = [];
  const map = getNodes(tree, rootId);
  const order = [];

  function traverse(id) {
    if (!id || !map[id]) return;
    traverse(map[id].left);
    order.push(id);
    frames.push({ highlighted: id, order: [...order] });
    traverse(map[id].right);
  }
  traverse(rootId);
  return frames;
}

export function preorderTraversal(tree, rootId) {
  const frames = [];
  const map = getNodes(tree, rootId);
  const order = [];

  function traverse(id) {
    if (!id || !map[id]) return;
    order.push(id);
    frames.push({ highlighted: id, order: [...order] });
    traverse(map[id].left);
    traverse(map[id].right);
  }
  traverse(rootId);
  return frames;
}

export function postorderTraversal(tree, rootId) {
  const frames = [];
  const map = getNodes(tree, rootId);
  const order = [];

  function traverse(id) {
    if (!id || !map[id]) return;
    traverse(map[id].left);
    traverse(map[id].right);
    order.push(id);
    frames.push({ highlighted: id, order: [...order] });
  }
  traverse(rootId);
  return frames;
}

export function levelorderTraversal(tree, rootId) {
  const frames = [];
  const map = getNodes(tree, rootId);
  const order = [];
  const queue = [rootId];

  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || !map[id]) continue;
    order.push(id);
    frames.push({ highlighted: id, order: [...order] });
    if (map[id].left)  queue.push(map[id].left);
    if (map[id].right) queue.push(map[id].right);
  }
  return frames;
}
