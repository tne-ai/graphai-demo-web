import { GraphData } from "graphai";
import { NodeData } from "graphai/lib/type";

const arrays = (num: number) => {
  return new Array(num).fill(undefined);
};
const randomInt = (num: number) => {
  return Math.floor(Math.random() * num);
};
export const generateGraph = (): GraphData => {
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
