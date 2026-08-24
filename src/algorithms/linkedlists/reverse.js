export function reverseLinkedList(nodesArray, headId) {
  const frames = [];

  let nodes = JSON.parse(JSON.stringify(nodesArray));
  let prevId = null;
  let currId = headId;
  let nextId = null;

  const pushFrame = (action) => {
    frames.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: { prev: prevId, curr: currId, next: nextId },
      action
    });
  };

  pushFrame('Initialize prev=null, curr=head, next=null');

  let iterations = 0;
  const MAX_ITERATIONS = nodes.length * 2 + 5;

  while (currId !== null) {
    if (iterations++ > MAX_ITERATIONS) {
      pushFrame('Infinite loop detected! Cycle broken by safety guard.');
      break;
    }

    const currNode = nodes.find(n => n.id === currId);

    nextId = currNode.nextId;
    pushFrame('next = curr.next');

    currNode.nextId = prevId;
    pushFrame('curr.next = prev');

    prevId = currId;
    currId = nextId;
    pushFrame('prev = curr, curr = next');
  }

  return { frames, newHeadId: prevId };
}
