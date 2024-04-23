import * as express from "express";

// import { GraphAI, AgentFunction } from "graphai";
import { defaultTestAgents } from "../graphai/agents/agents";

export const hello_response = async (req: express.Request, res: express.Response) => {
  res.json({ message: "hello" });
};

const agentDispatcher = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const { agentId } = params;
  const { nodeId, retry, params: agentParams, inputs, forkIndex } = req.body;
  const agent = defaultTestAgents[agentId];
  if (agent === undefined) {
    res.status(404).send("Not found");
    return;
  }
  const result = await agent({
    params: agentParams,
    inputs,
    debugInfo: {
      nodeId,
      retry,
      forkIndex,
      verbose: false,
    },
    agents: defaultTestAgents,
  });
  res.json(result);
};

const agentsList = async (req: express.Request, res: express.Response) => {
  const agents = Object.keys(defaultTestAgents);
  res.json({ agents });
};

export const app = express();

app.use(express.json());
app.post("/api/agents/:agentId", agentDispatcher);
app.get("/api/agents", agentsList);
app.get("/api/hello", hello_response);
