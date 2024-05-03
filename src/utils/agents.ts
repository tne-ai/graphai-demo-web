import { AgentFunction } from "graphai";
import { sleep } from "@/utils/utils";

export const sleepTestAgent: AgentFunction<{ duration?: number }> = async (context) => {
  const { params, inputs } = context;
  await sleep(params?.duration ?? 500);
  return inputs[0];
};

export const httpAgent: AgentFunction = async ({ inputs, params }) => {
  const { agentId } = params;
  const url = "https://graphai-demo.web.app/api/agents/" + agentId;

  const postData = { inputs, params };

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  return await response.json();
};
