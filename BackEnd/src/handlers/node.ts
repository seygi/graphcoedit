import NodeModel, { INode } from '../components/node/node.model';

export const addNodeExclusive = async (prevNodeId: string | null) => {
  try {
    const newNode = new NodeModel();
    // newNode.prev = prevNodeId;
  
    if (prevNodeId) {
      const prevNode = await NodeModel.findById(prevNodeId);
      if (prevNode) {
        newNode.next = prevNode.next;
        prevNode.next = newNode._id;
        await prevNode.save();
      }
    }
  
    await newNode.save();
  
    return newNode;
  } catch (error) {
    console.error('Error adding node:', error);
    throw error;
  }
};

export const removeNodeExclusive = async (nodeId: string) => {
  try {
    const node = await NodeModel.findById(nodeId);
  
    if (!node) {
      throw new Error('Node not found');
    }
  
    const prevNode = await NodeModel.findById(node.prev);
    const nextNode = await NodeModel.findById(node.next);
  
    if (prevNode) {
      prevNode.next = node.next;
      await prevNode.save();
    }
  
    if (nextNode) {
      nextNode.prev = node.prev;
      await nextNode.save();
    }
  
    await node.remove();
  } catch (error) {
    console.error('Error removing node:', error);
    throw error;
  }
};
