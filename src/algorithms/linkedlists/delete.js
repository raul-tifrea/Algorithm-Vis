export function deleteLinkedList(nodesArray, headId, targetId) {
  const frames = [];
  let nodes = JSON.parse(JSON.stringify(nodesArray));
  
  let prevId = null;
  let currId = headId;
  let targetNodeId = targetId;

  const pushFrame = (action) => {
    frames.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev: prevId, curr: currId, target: targetNodeId },
      action
    });
  };

  pushFrame('Start deletion search');

  if (headId === targetId) {
    pushFrame('Target is at head');
    const headN = nodes.find(n => n.id === headId);
    let newHeadId = headN.nextId;
    headN.nextId = null; 
    pushFrame('Detached head. Return new head.');
    
    nodes = nodes.map(n => n.id === targetId ? { ...n, deleted: true } : n);
    pushFrame('Deleted node fading out');
    return { frames, newHeadId };
  }

  while (currId !== null && currId !== targetId) {
    prevId = currId;
    pushFrame('prev = curr');
    const currNode = nodes.find(n => n.id === currId);
    currId = currNode.nextId;
    pushFrame('curr = curr.next');
  }

  if (currId === targetId) {
    pushFrame('Found target node');
    const prevN = nodes.find(n => n.id === prevId);
    const currN = nodes.find(n => n.id === currId);
    prevN.nextId = currN.nextId;
    pushFrame('prev.next = curr.next (bypassing curr)');
    
    currN.nextId = null;
    pushFrame('Detached curr');
    
    nodes = nodes.map(n => n.id === targetId ? { ...n, deleted: true } : n);
    pushFrame('Deleted node fading out');
  } else {
    pushFrame('Target not found in list');
  }

  return { frames, newHeadId: headId };
}
