import { AgentFunction } from "graphai";

export const agentListApi = async () => {
  const url = "https://graphai-demo.web.app/api/agents";

  const response = await fetch(url);
  return await response.json();
};

export const httpAgent: AgentFunction = async ({ inputs, params }) => {
  const { agentId, params: postParams } = params;
  const url = "https://graphai-demo.web.app/api/agents/" + agentId;

  const postData = { inputs, params: postParams };

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  return await response.json();
};

export const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

