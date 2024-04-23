import { AgentFunction } from "graphai";
import toJsonSchema from "to-json-schema";

import slashGPTFuncitons2TextAgentInfo from "./slashgpt_agent";

const agents: [
  {
    name: string;
    agent: AgentFunction<any, any, any>;
    doc: {
      inputs_example?: Array<Record<string, unknown>>;
      inputs?: Array<Record<string, unknown>>;
      response_example?: Record<string, unknown>;
      response?: Record<string, unknown>;
    };
  },
] = [slashGPTFuncitons2TextAgentInfo];

export const agentDocs = agents.reduce((tmp: Record<string, unknown>, agent) => {
  if (agent.name && agent.doc) {
    const doc = agent.doc;
    if (doc.inputs_example && doc.inputs === undefined) {
      doc.inputs = toJsonSchema(doc.inputs_example) as any;
    }
    if (doc.response_example && doc.response === undefined) {
      doc.response = toJsonSchema(doc.response_example) as any;
    }

    tmp[agent.name] = doc;
  }
  return tmp;
}, {});
