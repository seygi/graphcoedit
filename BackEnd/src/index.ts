import http from "http";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { ClientToServerEvents, ServerToClientEvents } from "./models/SocketEvents";
import { getNodes } from "./components/node/node.service";
import { addNodeExclusive, removeNodeExclusive } from "./handlers/node";
import { INode } from "./components/node/node.model";
import {
  INodeAddedData,
  INodeRemovedData,
  IUpdatedNodes,
  INodesData,
} from "./models/SocketData";

dotenv.config();

const app = express();

const { PORT, MONGODB_PRIMARY_HOST, MONGODB_PORT, MONGODB_DATABASE } =
  process.env;

const dbUrl = `mongodb://${MONGODB_PRIMARY_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;

mongoose.connect(dbUrl);
mongoose.connection.on("error", () => {
  throw new Error(`Unable to connect to the database: ${dbUrl}`);
});

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  getNodes().then((nodes) => {
    const data: INodesData = { nodes };
    io.emit("nodes", data);
  });

  socket.on("addNode", (prevNodeId: string | null) => {
    addNodeExclusive(prevNodeId).then((createdNode: INode) => {
      const updatedNodes: IUpdatedNodes = {};
      io.emit("nodeAdded", { createdNode, updatedNodes });
    });
  });

  socket.on("removeNode", (nodeId: string) => {
    removeNodeExclusive(nodeId).then(() => {
      const updatedNodes: IUpdatedNodes = {};
      const data: INodeRemovedData = { deletedNodeId: nodeId, updatedNodes };
      io.emit("nodeRemoved", data);
    });
  });
});

server.on("error", (err) => {
  console.error(err);
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
