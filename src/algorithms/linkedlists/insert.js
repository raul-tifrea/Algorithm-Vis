export function insertLinkedList(nodesArray, headId, newNodeId, targetId) {
  const frames = [];
  let nodes = JSON.parse(JSON.stringify(nodesArray));
  
  let prevId = null;
  let currId = headId;
  let newId = newNodeId;

  const pushFrame = (action) => {
    frames.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev: prevId, curr: currId, new: newId },
      action
    });
  };

  pushFrame('Start insertion');

  if (headId === targetId) {
    pushFrame('Inserting at head');
    const newN = nodes.find(n => n.id === newId);
    newN.nextId = headId;
    pushFrame('new.next = head');
    return { frames, newHeadId: newId };
  }

  let iterations = 0;
  const MAX_ITERATIONS = nodes.length * 2 + 5;

  while (currId !== null && currId !== targetId) {
    if (iterations++ > MAX_ITERATIONS) {
      pushFrame('Infinite loop detected! Safety guard activated.');
      break;
    }
    prevId = currId;
    pushFrame('prev = curr');
    const currNode = nodes.find(n => n.id === currId);
    currId = currNode.nextId;
    pushFrame('curr = curr.next');
  }

  pushFrame('Found insertion point');
  
  const newN = nodes.find(n => n.id === newId);
  newN.nextId = currId;
  pushFrame('new.next = curr');
  
  if (prevId) {
    const prevN = nodes.find(n => n.id === prevId);
    prevN.nextId = newId;
    pushFrame('prev.next = new');
  }

  return { frames, newHeadId: headId };
}
