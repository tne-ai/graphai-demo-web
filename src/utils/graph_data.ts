import { GraphData } from "graphai";
import { randomInt } from "./graph";

export const graph_data: GraphData = {
  version: 0.5,
  loop: {
    while: ":source",
  },
  nodes: {
    source: {
      value: ["orange", "banana", "lemon", "orange", "banana", "lemon", "orange", "banana", "lemon", "orange", "banana", "lemon"],
      update: ":popper.array",
    },
    result: {
      value: [],
      update: ":reducer",
      isResult: true,
    },
    sleeper1: {
      agent: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: { array: [":source"] },
    },
    sleeper2: {
      agent: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: { item: ":sleeper1" },
    },
    sleeper3: {
      agent: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: { item: ":sleeper2" },
    },
    sleeper4: {
      agent: "sleepTestAgent",
      params: {
        duration: 200,
      },
      inputs: { item: ":sleeper3" },
    },
    popper: {
      inputs: { array: ":sleeper4" },
      agent: "popAgent", // returns { array, item }
    },
    reducer: {
      agent: "pushAgent",
      inputs: { array: ":result", item: ":popper.item" },
    },
  },
};

export const graph_data2: GraphData = {
  version: 0.5,
  nodes: {
    node1: {
      value: { message: "Hello World" },
    },
    node2: {
      agent: "sleepTestAgent",
      inputs: { array: [":node1"] },
    },
    node3: {
      agent: "sleepTestAgent",
      inputs: { array: [":node2"] },
    },
    node4: {
      agent: "sleepTestAgent",
      inputs: { array: [":node2", ":node3"] },
    },
    node5: {
      agent: "sleepTestAgent",
      inputs: { array: [":node3", ":node4"] },
    },
    node6: {
      agent: "sleepTestAgent",
      inputs: { array: [":node1", ":node5"] },
    },
    node7: {
      agent: "sleepTestAgent",
      inputs: { array: [":node3", ":node5"] },
    },
    node8: {
      agent: "sleepTestAgent",
      inputs: { array: [":node2", ":node5", ":node3"] },
    },
    node9: {
      agent: "sleepTestAgent",
      inputs: { array: [":node4", ":node8", ":node6"] },
    },
    node10: {
      agent: "sleepTestAgent",
      inputs: { array: [":node5", ":node6", ":node7"] },
    },
    node11: {
      agent: "sleepTestAgent",
      inputs: { array: [":node3", ":node6", ":node7"] },
    },
    node12: {
      agent: "sleepTestAgent",
      inputs: { array: [":node10", ":node11", ":node9"] },
    },
  },
};

export const graph_data_http = {
  version: 0.5,
  nodes: {
    echo: {
      agent: "httpAgent",
      params: {
        agent: "echoAgent",
        message: "hello",
      },
    },
    bypassAgent: {
      agent: "httpAgent",
      inputs: { text: ":echo" },
      params: {
        agent: "bypassAgent",
      },
    },
    sleepAgent: {
      agent: "httpAgent",
      inputs: { text: ":echo" },
      params: {
        agent: "sleeperAgent",
        duration: 1000,
      },
    },
    bypassAgent2: {
      agent: "httpAgent",
      inputs: { text: ":bypassAgent" },
      params: {
        agent: "bypassAgent",
      },
      isResult: true,
    },
  },
};

export const graph_data_co2 = {
  version: 0.5,
  nodes: {
    slashGPTAgent: {
      agent: "httpAgent",
      params: {
        agent: "slashGPTAgent",
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
      inputs: { array: ":slashGPTAgent" },
      agent: "slashGPTFuncitons2TextAgent",
    },
    mapNode: {
      agent: "mapAgent",
      inputs: { rows: ":function2prompt0" },
      params: {
        injectionTo: ["memory"],
      },
      isResult: true,
      graph: {
        nodes: {
          slashGPTAgent0: {
            agent: "httpAgent",
            params: {
              agent: "slashGPTAgent",
              manifest: {
                prompt: "ユーザの問い合わせにある文章の専門家です。専門家として、ユーザのアイデアに対して実現可能なシナリオを100文字で書いてください。",
              },
            },
            inputs: { array: [":row"] },
          },
          bypassAgent: {
            agent: "bypassAgent",
            inputs: { result: ":slashGPTAgent0.$last.content" },
            isResult: true,
          },
        },
      },
    },
  },
};

export const graph_data_stream: GraphData = {
  version: 0.5,
  nodes: {
    user_query: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    generate_code: {
      agent: "streamMockAgent",
      inputs: { array: [":user_query"] },
      params: {
        message: "session = TNE(uid=UID, bucket_name=BUCKET, project=PROJECT, version=VERSION)\n\ndf = session.get_object(\"shopping_list_with_periods_cleaned.csv\")\n\ndf['Discount'] = (df['standard_selling_price'] - df['aur']) * df['sales']\n\ntotal_discount_value = df['Discount'].sum()\n\nresult = pd.DataFrame({\n'Total Discount Value': [total_discount_value]\n})\n\nreturn result\n",
        sleep: randomInt(10),
      },
    },
    execute_code: {
      agent: "streamMockAgent",
      inputs: { array: [":generate_code"] },
      params: {
        message: "\"   Total Discount Value\n\n  0          2.080744e+06\n,",
        sleep: .1
      }
    },
    chat_response: {
      agent: "streamMockAgent",
      inputs: { array: [":execute_code"] },
      params: {
        message: "The total discount value of crossbody bags over the period is £2,080,744",
        sleep: randomInt(50)
      }
    },
  },
};

export const graphChat = {
  version: 0.5,
  loop: {
    while: ":continue",
  },
  nodes: {
    continue: {
      value: true,
      update: ":checkInput.continue",
    },
    messages: {
      value: [],
      update: ":reducer",
    },
    userInput: {
      agent: "textInputAgent",
      params: {
        message: "You:",
      },
    },
    checkInput: {
      agent: "propertyFilterAgent",
      params: {
        inspect: [
          {
            propId: "continue",
            notEqual: "/bye",
          },
        ],
      },
      inputs: {
        array: [
          {
            dummy: 1,
          },
          ":userInput",
        ],
      },
    },
    userMessage: {
      agent: "propertyFilterAgent",
      params: {
        inject: [
          {
            propId: "content",
            from: 1,
          },
        ],
      },
      inputs: {
        array: [
          {
            role: "user",
          },
          ":userInput",
        ],
      },
    },
    appender: {
      agent: "pushAgent",
      inputs: {
        array: ":messages",
        item: ":userMessage",
      },
    },
    llm: {
      agent: "openAIAgent",
      params: {
        forWeb: true,
        apiKey: import.meta.env.VITE_OPEN_API_KEY,
        stream: true,
      },
      inputs: {
        messages: ":appender",
      },
    },
    output: {
      agent: "stringTemplateAgent",
      console: {
        after: true,
      },
      params: {
        template: "LLM: ${text}",
      },
      inputs: {
        text: ":llm.text",
      },
    },
    llmResponse: {
      agent: "stringTemplateAgent",
      params: {
        template: {
          role: "assistant",
          content: "${text}",
        },
      },
      inputs: {
        text: ":llm.text",
      },
    },
    reducer: {
      agent: "pushAgent",
      inputs: {
        array: ":appender",
        item: ":llmResponse",
      },
    },
  },
};
