import { AgentFunctionDictonary } from "graphai";

import { pushAgent, popAgent, shiftAgent } from "graphai/lib/experimental_agents/array_agents";
import { dataObjectMergeTemplateAgent } from "graphai/lib/experimental_agents/data_agents";
import { dotProductAgent, sortByValuesAgent } from "graphai/lib/experimental_agents/matrix_agent";
import { nestedAgent } from "graphai/lib/experimental_agents/nested_agent";
import { sleeperAgent } from "graphai/lib/experimental_agents/sleeper_agents";
import { stringTemplateAgent, stringSplitterAgent } from "graphai/lib/experimental_agents/string_agents";
import { bypassAgent, echoAgent, mergeNodeIdAgent } from "graphai/lib/experimental_agents/test_agents";

import { slashGPTFuncitons2TextAgent } from "./slashgpt_agent";

export const defaultTestAgents: AgentFunctionDictonary = {
  bypassAgent,
  echoAgent,
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

  slashGPTFuncitons2TextAgent,
};
