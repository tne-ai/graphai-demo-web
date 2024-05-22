import express from "express";
import cors from "cors";

import { AgentFunctionInfoDictionary } from "graphai/lib/type";
import { agentDispatcher, agentsList, agentDoc } from "@receptron/graphai_express";

import * as agents from "graphai/lib/experimental_agents";

const hostName = "https://graphai-demo.web.app";
const agentDictionary: AgentFunctionInfoDictionary = agents;

export const app = express();

const allowedOrigins = ["http://localhost:8080", hostName];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(express.json());
app.use(cors(options));
app.post("/api/agents/:agentId", agentDispatcher(agentDictionary));

// app.get("/api/agents/:agentId/docs", agentDocsReq);
app.get("/api/agents", agentsList(agentDictionary, hostName, "/agents"));
app.get("/api/agents/:agentId", agentDoc(agentDictionary, hostName, "/agents"));



