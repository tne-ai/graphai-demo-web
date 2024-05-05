import { GraphData } from "graphai";
import { randomInt } from "./graph";

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

export const graph_data_co2 = {
  nodes: {
    slashGPTAgent: {
      agentId: "httpAgent",
      params: {
        agentId: "slashGPTAgent",
        function_result: true,
        query: "世界で協力してco2を減らす方法を教えて下さい",
        manifest: {
          prompt: "あなたは世界経済の専門家です。ユーザの問い合わせについて考え、10この結果をfunctionsの結果に返してください。",
          skip_function_result: true,
          actions: {
            your_ideas: {
              type: "message_template",
              message: "dummy",
            },
          },
          functions: [
            {
              name: "your_ideas",
              description: "Your answer to a user's inquiry",
              parameters: {
                type: "object",
                properties: {
                  methods: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          description: "title",
                        },
                        description: {
                          type: "string",
                          description: "description",
                        },
                      },
                      required: ["title", "description"],
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    function2prompt0: {
      params: {
        function_data_key: "methods",
        result_key: 0,
      },
      inputs: ["slashGPTAgent"],
      agentId: "slashGPTFuncitons2TextAgent",
    },
    mapNode: {
      agentId: "mapAgent",
      inputs: ["function2prompt0.$0", "function2prompt0.$1", "function2prompt0.$2", "function2prompt0.$3", "function2prompt0.$4", "function2prompt0.$5"],
      params: {
        injectionTo: ["memory"],
      },
      isResult: true,
      graph: {
        nodes: {
          memory: {
            value: {},
          },
          slashGPTAgent0: {
            agentId: "httpAgent",
            params: {
              agentId: "slashGPTAgent",
              manifest: {
                prompt: "ユーザの問い合わせにある文章の専門家です。専門家として、ユーザのアイデアに対して実現可能なシナリオを100文字で書いてください。",
              },
            },
            inputs: ["memory"],
          },
          bypassAgent: {
            agentId: "bypassAgent",
            inputs: ["slashGPTAgent0.$last.content"],
            isResult: true,
          },
        },
      },
    },
  },
};

export const graph_data_stream: GraphData = {
  version: 0.2,
  nodes: {
    echo: {
      agentId: "echoAgent",
      params: {
        message: "hello",
      },
    },
  },
};

const messages = [
  "French: Bonjour. Ceci est un test de diffusion en continu.",
  "German: Hallo. Dies ist ein Streaming-Test.",
  "Italian: Ciao. Questo è un test di streaming.",
  "Portuguese: Olá. Este é um teste de streaming.",
  "Chinese (Simplified): 你好。这是一个流媒体测试。",
  "Japanese: こんにちは。これはストリーミングのテストです。",
  "Korean: 안녕하세요. 이것은 스트리밍 테스트입니다.",
  "Hindi: नमस्ते। यह एक स्ट्रीमिंग परीक्षण है।",
  "Dutch: Hallo. Dit is een streamingtest.",
  "Greek: Γεια σας. Αυτό είναι ένα τεστ ροής.",
  "Swedish: Hej. Det här är ett streamingtest.",
  "Turkish: Merhaba. Bu bir akış testidir.",
  "Polish: Cześć. To test przesyłania strumieniowego.",
  "Vietnamese: Xin chào. Đây là một bài kiểm tra phát sóng.",
];

Array.from(messages.keys()).forEach((k) => {
  const message = messages[k];
  const inputs = k > 2 ? ["streamMockAgent" + (k - 3)] : ["echo"];
  graph_data_stream["nodes"]["streamMockAgent" + k] = {
    agentId: "streamMockAgent",
    inputs,
    params: {
      message: message,
      sleep: randomInt(800),
    },
  };
});
