// import Node from "../src/components/node/node.model";
// import { assert } from "chai";
// import { addNodeExclusive, removeNodeExclusive } from "../src/handlers/node";

// describe("conflicting updates test", () => {
//   it("add two nodes for one prev", async () => {
//     const firstNode = new Node();
//     await firstNode.save();

//     const result = await Promise.all([
//       addNodeExclusive(firstNode.id),
//       addNodeExclusive(firstNode.id)
//     ]);

//     assert.deepEqual(result[1].updatedNodes, {
//       [firstNode.id]: {
//         next: result[1].createdNode.id
//       },
//       [result[0].createdNode.id]: {
//         prev: result[1].createdNode.id
//       }
//     });
//   });

//   it("add node for deleted prev", async () => {
//     const firstNode = new Node();
//     await firstNode.save();

//     const result = await Promise.allSettled([
//       removeNodeExclusive(firstNode.id),
//       addNodeExclusive(firstNode.id)
//     ]);

//     assert.ok(result[0].status === "fulfilled" && (result[1].status === "rejected" && result[1].reason.message === "Node deleted"));
//   });
// });
