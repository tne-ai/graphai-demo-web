import { AgentFunction, AgentFunctionDictonary } from "graphai";

import { pushAgent, popAgent, shiftAgent } from "graphai/lib/experimental_agents/array_agents";
import { dataObjectMergeTemplateAgent } from "graphai/lib/experimental_agents/data_agent";
import { dotProductAgent, sortByValuesAgent } from "graphai/lib/experimental_agents/matrix_agent";
import { nestedAgent } from "graphai/lib/experimental_agents/nested_agent";
import { sleeperAgent } from "graphai/lib/experimental_agents/sleeper_agent";
import { stringTemplateAgent, stringSplitterAgent } from "graphai/lib/experimental_agents/string_agent";

export const bypassAgent: AgentFunction = async (context) => {
  if (context.inputs.length === 1) {
    return context.inputs[0];
  }
  return context.inputs;
};
export const echoAgent: AgentFunction = async ({ params }) => {
  return params;
};
export const echoForkIndexAgent: AgentFunction = async ({ debugInfo: { forkIndex } }) => {
  return { forkIndex };
};

export const mergeNodeIdAgent: AgentFunction = async ({ debugInfo: { nodeId }, inputs }) => {
  // console.log("executing", nodeId);
  return inputs.reduce(
    (tmp, input) => {
      return { ...tmp, ...input };
    },
    { [nodeId]: "hello" },
  );
};

export const defaultTestAgents: AgentFunctionDictonary = {
  bypassAgent,
  echoAgent,
  echoForkIndexAgent,
  mergeNodeIdAgent,
  dataObjectMergeTemplateAgent,

  pushAgent,
  popAgent,
  shiftAgent,
  dotProductAgent,
  sortByValuesAgent,
  nestedAgent,
  sleeperAgent,
  stringTemplateAgent,
  stringSplitterAgent,
};
