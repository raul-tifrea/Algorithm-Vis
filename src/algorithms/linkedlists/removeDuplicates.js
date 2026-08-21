export function removeDuplicates(nodesArray, headId) {
  const frames = [];
  let nodes = JSON.parse(JSON.stringify(nodesArray));

  let prevId = null;
  let currId = headId;

  const pushFrame = (action, prev, curr) => {
    frames.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev, curr },
      action
    });
  };

  pushFrame('Start remove duplicates', prevId, currId);

  const seen = new Set();
  const visitedIds = new Set(); // To detect cycles
  
  if (currId !== null) {
    const headNode = nodes.find(n => n.id === currId);
    seen.add(headNode.val);
    visitedIds.add(headNode.id);
    prevId = currId;
    currId = headNode.nextId;
    pushFrame('First node is always unique', prevId, currId);
  }

  let iterations = 0;
  const MAX_ITERATIONS = nodes.length * 2 + 5;

  while (currId !== null) {
    if (iterations++ > MAX_ITERATIONS) {
      pushFrame('Infinite loop detected! Safety guard activated.', prevId, currId);
      break;
    }

    if (visitedIds.has(currId)) {
      pushFrame('Safety guard: Infinite loop prevented. Stopping.', prevId, currId);
      break;
    }
    visitedIds.add(currId);

    const currNode = nodes.find(n => n.id === currId);
    let nextId = currNode.nextId;

    pushFrame(`Checking current node (${currNode.val})`, prevId, currId);

    if (seen.has(currNode.val)) {
      pushFrame('Duplicate value found! Bypassing node.', prevId, currId);
      const prevNode = nodes.find(n => n.id === prevId);
      prevNode.nextId = currNode.nextId;
      currNode.nextId = null; // Detach
      
      nodes = nodes.map(n => n.id === currId ? { ...n, deleted: true } : n);
      pushFrame('Deleted duplicate node fading out', prevId, currId);
      
      currId = prevNode.nextId;
    } else {
      seen.add(currNode.val);
      pushFrame('Value is unique. prev = curr', currId, currId);
      prevId = currId;
      currId = nextId;
      if (nextId === null) {
        pushFrame('Reached end of list', currId, null);
      }
    }
  }

  return { frames, newHeadId: headId };
}
