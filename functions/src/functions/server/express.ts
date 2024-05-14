import express from "express";
import cors from "cors";

import { AgentFunctionInfo } from "graphai/lib/type";
// import { GraphAI, AgentFunction } from "graphai";
// import { defaultTestAgents } from "../graphai/agents/agents";
// import { agentDocs } from "../graphai/agents/agentDocs";
import * as agents from "graphai/lib/experimental_agents";

const hostName = "https://graphai-demo.web.app";

export const hello_response = async (req: express.Request, res: express.Response) => {
  res.json({ message: "hello" });
};

const agentDispatcher = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const { agentId } = params;
  const { nodeId, retry, params: agentParams, inputs } = req.body;
  const agent = (agents as any)[agentId] as AgentFunctionInfo;
  if (agent === undefined) {
    res.status(404).send("Not found");
    return;
  }
  const result = await agent.agent({
    params: agentParams,
    inputs,
    debugInfo: {
      nodeId,
      retry,
      verbose: false,
    },
    agents,
    filterParams: {},
  });
  res.json(result);
};

const agentsList = async (req: express.Request, res: express.Response) => {
  const list = Object.keys(agents).map((agent) => {
    return {
      agentId: agent,
      url: hostName + "/api/agents/" + agent,
      apiDoc: hostName + "/api/agents/" + agent + "/docs",
      description: "foo bar",
      author: "satoshi isamu",
      repository: "https://github.com/snakajima/graphai/",
    };
  });
  res.json({ agents: list });
};

/*
const agentDocsReq = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const { agentId } = params;
  if (agentDocs[agentId]) {
    return res.json(agentDocs[agentId]);
  }
  return res.json({});
};
*/
export const app = express();

const allowedOrigins = ["http://localhost:8080", hostName];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(express.json());
app.use(cors(options));
app.post("/api/agents/:agentId", agentDispatcher);

// app.get("/api/agents/:agentId/docs", agentDocsReq);
app.get("/api/agents", agentsList);
app.get("/api/hello", hello_response);
