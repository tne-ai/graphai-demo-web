import { AgentFunction } from "graphai";
import { NodeData } from "graphai/lib/type";

const arrays = (num: number) => {
  return new Array(num).fill(undefined);
};
const randomInt = (num: number) => {
  return Math.floor(Math.random() * num);
};
export const generateGraph = () => {
  const nodes: Record<string, NodeData> = {};
  const inputsNode: string[] = [];
  arrays(10).forEach((__i, k) => {
    const name = "static_" + k;
    inputsNode.push(name);
    nodes[name] = {
      value: name,
    };
  });

  arrays(50).forEach((__i, k) => {
    const name = "node_" + k;

    const inputs = arrays(randomInt(3) + 1).map(() => {
      const rand = randomInt(inputsNode.length);
      return inputsNode[rand];
    });

    nodes[name] = {
      agentId: "sleepTestAgent",
      params: {
        duration: randomInt(10) * 400,
      },
      priority: Math.random() > 0.5 ? 1 : 0, // 50% will have priority = 1
      inputs,
    };
    inputsNode.push(name);
  });

  return {
    nodes,
  };
};

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
