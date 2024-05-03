import { GraphData } from "graphai";

export const graph_data: GraphData = {
  loop: {
    while: "source",
  },
  nodes: {
    source: {
      value: ["orange", "banana", "lemon", "orange", "banana", "lemon", "orange", "banana", "lemon", "orange", "banana", "lemon"],
      update: "popper.array",
    },
    result: {
      value: [],
      update: "reducer",
      isResult: true,
    },
    sleeper1: {
      agentId: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: ["source"],
    },
    sleeper2: {
      agentId: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: ["sleeper1"],
    },
    sleeper3: {
      agentId: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: ["sleeper2"],
    },
    sleeper4: {
      agentId: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: ["sleeper3"],
    },
    popper: {
      inputs: ["sleeper4"],
      agentId: "popAgent", // returns { array, item }
    },
    reducer: {
      agentId: "pushAgent",
      inputs: ["result", "popper.item"],
    },
  },
};

export const graph_data2: GraphData = {
  nodes: {
    node1: {
      value: { message: "Hello World" },
    },
    node2: {
      agentId: "sleepTestAgent",
      inputs: ["node1"],
    },
    node3: {
      agentId: "sleepTestAgent",
      inputs: ["node2"],
    },
    node4: {
      agentId: "sleepTestAgent",
      inputs: ["node2", "node3"],
    },
    node5: {
      agentId: "sleepTestAgent",
      inputs: ["node3", "node4"],
    },
    node6: {
      agentId: "sleepTestAgent",
      inputs: ["node1", "node5"],
    },
    node7: {
      agentId: "sleepTestAgent",
      inputs: ["node3", "node5"],
    },
    node8: {
      agentId: "sleepTestAgent",
      inputs: ["node2", "node5", "node3"],
    },
    node9: {
      agentId: "sleepTestAgent",
      inputs: ["node4", "node8", "node6"],
    },
    node10: {
      agentId: "sleepTestAgent",
      inputs: ["node5", "node6", "node7"],
    },
    node11: {
      agentId: "sleepTestAgent",
      inputs: ["node3", "node6", "node7"],
    },
    node12: {
      agentId: "sleepTestAgent",
      inputs: ["node10", "node11", "node9"],
    },
  },
};

export const graph_data_http = {
  nodes: {
    echo: {
      agentId: "httpAgent",
      params: {
        agentId: "echoAgent",
        message: "hello",
      },
    },
    bypassAgent: {
      agentId: "httpAgent",
      inputs: ["echo"],
      params: {
        agentId: "bypassAgent",
      },
    },
    sleepAgent: {
      agentId: "httpAgent",
      inputs: ["echo"],
      params: {
        agentId: "sleeperAgent",
        duration: 1000,
      },
    },
    bypassAgent2: {
      agentId: "httpAgent",
      inputs: ["bypassAgent"],
      params: {
        agentId: "bypassAgent",
      },
      isResult: true,
    },
  },
};
