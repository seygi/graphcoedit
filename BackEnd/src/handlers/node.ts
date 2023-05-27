import NodeModel, { INode } from '../components/node/node.model';
import { INodeAddedData, INodeRemovedData, INodesData, IUpdatedNodes } from "../models/SocketData";

export const addNodeExclusive = async (prevNodeId: string | null): Promise<INodeAddedData> => {
    try {
      const newNode = new NodeModel();
    //   newNode.prev = prevNodeId;
  
      if (prevNodeId) {
        const prevNode = await NodeModel.findById(prevNodeId);
        if (prevNode) {
          newNode.next = prevNode.next;
          prevNode.next = newNode.id;
          await prevNode.save();
        }
      }
  
      await newNode.save();
  
      const updatedNodes: IUpdatedNodes = {}; // Initialize empty object for updated nodes
  
      return {
        createdNode: newNode,
        updatedNodes,
      };
    } catch (error) {
      console.error('Error adding node:', error);
      throw error;
    }
  };
  
  

  export const removeNodeExclusive = async (nodeId: string): Promise<INodeRemovedData> => {
    try {
      const removedNode = await NodeModel.findByIdAndRemove(nodeId);
  
      if (!removedNode) {
        throw new Error(`Node with ID ${nodeId} not found.`);
      }
  
      const updatedNodes: IUpdatedNodes = {}; // Initialize empty object for updated nodes
  
      // Update the previous node's 'next' reference if applicable
      if (removedNode.prev) {
        const prevNode = await NodeModel.findById(removedNode.prev);
        if (prevNode) {
          prevNode.next = removedNode.next;
          await prevNode.save();
  
          updatedNodes[prevNode.id.toString()] = { next: prevNode.next?.toString() };
        }
      }
  
      // Update the next node's 'prev' reference if applicable
      if (removedNode.next) {
        const nextNode = await NodeModel.findById(removedNode.next);
        if (nextNode) {
          nextNode.prev = removedNode.prev;
          await nextNode.save();
  
          updatedNodes[nextNode.id.toString()] = { prev: nextNode.prev?.toString() };
        }
      }
  
      return {
        deletedNodeId: removedNode.id.toString(),
        updatedNodes,
      };
    } catch (error) {
      console.error('Error removing node:', error);
      throw error;
    }
  };
  
