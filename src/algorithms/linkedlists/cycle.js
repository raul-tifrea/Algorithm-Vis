export function cycleDetection(nodesArray, headId) {
  const frames = [];
  let nodes = JSON.parse(JSON.stringify(nodesArray));
  
  let slowId = headId;
  let fastId = headId;
  let cycleFound = false;

  const pushFrame = (action) => {
    frames.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { slow: slowId, fast: fastId },
      cycleFound,
      action
    });
  };

  pushFrame('Initialize slow and fast pointers at head');

  let iterations = 0;
  const MAX_ITERATIONS = nodes.length * 2 + 5;

  while (fastId !== null) {
    if (iterations++ > MAX_ITERATIONS) {
      pushFrame('Safety guard activated. Unresolvable loop.');
      break;
    }
    const fastNode = nodes.find(n => n.id === fastId);
    if (fastNode.nextId === null) {
        pushFrame('Fast reached the end. No cycle.');
        break;
    }

    const slowNode = nodes.find(n => n.id === slowId);
    slowId = slowNode.nextId;
    pushFrame('slow = slow.next');

    const fastNodeNext = nodes.find(n => n.id === fastNode.nextId);
    fastId = fastNodeNext.nextId;
    
    if (slowId === fastId && slowId !== null) {
        cycleFound = true;
        pushFrame('fast = fast.next.next. Cycle detected!');
        break;
    }
    pushFrame('fast = fast.next.next');
  }

  if (!cycleFound) {
    pushFrame('Reached the end of the list. No cycle detected.');
  }

  return { frames, newHeadId: headId };
}
