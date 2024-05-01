import { AgentFunctionDictonary } from "graphai/lib/type";

import { stringTemplateAgent, stringSplitterAgent } from "graphai/lib/experimental_agents/string_agents";
import { sleeperAgent } from "graphai/lib/experimental_agents/sleeper_agents";
import { totalAgent, dataObjectMergeTemplateAgent, dataSumTemplateAgent } from "graphai/lib/experimental_agents/data_agents";
import { nestedAgent } from "graphai/lib/experimental_agents/nested_agent";
import { pushAgent, popAgent, shiftAgent } from "graphai/lib/experimental_agents/array_agents";
import { dotProductAgent, sortByValuesAgent } from "graphai/lib/experimental_agents/matrix_agent";
import { tokenBoundStringsAgent } from "graphai/lib/experimental_agents/token_agent";
import { bypassAgent, echoAgent, copyMessageAgent, mergeNodeIdAgent, countingAgent } from "graphai/lib/experimental_agents/test_agents";
import { mapAgent } from "graphai/lib/experimental_agents/map_agent";
import { slashGPTFuncitons2TextAgent } from "./slashgpt_agent";

export const defaultTestAgents: AgentFunctionDictonary = {
  stringTemplateAgent,
  stringSplitterAgent,

  sleeperAgent,

  totalAgent,
  dataObjectMergeTemplateAgent,
  dataSumTemplateAgent,

  nestedAgent,

  pushAgent,
  popAgent,
  shiftAgent,

  dotProductAgent,
  sortByValuesAgent,

  tokenBoundStringsAgent,
  
  bypassAgent,
  echoAgent,
  copyMessageAgent,
  mergeNodeIdAgent,
  countingAgent,
  
  mapAgent,
  
  slashGPTFuncitons2TextAgent,
};
