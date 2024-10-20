import { GraphData } from "graphai";
import { randomInt } from "./graph";
export const graph_data_stream: GraphData = {
  version: 0.5,
  nodes: {
    user_query: {
      agent: "streamMockAgent",
      params: {
        message: "What are the top 10 selling crossbody bag styles?",
        sleep: randomInt(30),
      },
    },
    generate_code: {
      agent: "streamMockAgent",
      inputs: { array: [":user_query"] },
      params: {
        message: 'import pandas as pd\nfrom tne.TNE import TNE\n\n# Initialize the TNE session\nsession = TNE(uid=UID, bucket_name=BUCKET, project=PROJECT, version=VERSION)\n\n# Load the data\ndf = session.get_object(" handbags-shopping_list - no_run - 1_1 - with_periods_cleaned.csv")\n\n# Filter for crossbody bags\ncrossbody_bags = df[df["product_subgroup_desc"] == "Crossbody bag"]\n\n# Group by style_colour_desc and sum the sales\nsales_by_style = crossbody_bags.groupby("style_colour_desc")["sales"].sum().reset_index()\n\n# Sort by sales in descending order and get the top 10\ntop_10_crossbody_bags = sales_by_style.sort_values(by="sales", ascending=False).head(10)\n\n# Store the result\nresult = top_10_crossbody_bags\n',
        sleep: randomInt(14),
      },
    },
    execute_code: {
      agent: "streamMockAgent",
      inputs: { array: [":generate_code"] },
      params: {
        message: "   style_colour_desc                        sales\n0  Handbag Crossbody bag Style 46648          899\n1  Handbag Crossbody bag Style 43477          822\n2  Handbag Crossbody bag Style 40077          810\n3  Handbag Crossbody bag Style 46672          761\n4  Handbag Crossbody bag Style 46724          651\n5  Handbag Crossbody bag Style 49873          536\n6  Handbag Crossbody bag Style 51977          521\n7  Handbag Crossbody bag Style 50173          517\n8  Handbag Crossbody bag Style 36694          435\n9  Handbag Crossbody bag Style 51990          424\n\"\n",
        sleep: randomInt(10)
      }
    },
    chat_response: {
      agent: "streamMockAgent",
      inputs: { array: [":execute_code"] },
      params: {
        message: "Demonstrate Understanding: The request is to identify the top 10 crossbody bags based on their sales performance. The term \"crossbody bags\" refers to a specific product subgroup within the handbag category. The request seeks to rank these bags by their total sales.\n" +
            "Explain the Method: The method used to generate the response involved filtering the dataset to include only crossbody bags, grouping the data by the style and color description, summing the sales for each style, and then sorting the results in descending order to identify the top 10 styles by sales.\n" +
            "Document the Execution: The data source used is a CSV file containing sales and inventory data for various handbag styles. The code filtered the data to include only rows where the product_subgroup_desc is \"Crossbody bag\". It then grouped the data by style_colour_desc and summed the sales for each group. The results were sorted by sales in descending order, and the top 10 entries were selected.\n" +
            "Answer: The top 10 crossbody bags based on sales are as follows:\n" +
            "   style_colour_desc                        sales\n0  Handbag Crossbody bag Style 46648          899\n1  Handbag Crossbody bag Style 43477          822\n2  Handbag Crossbody bag Style 40077          810\n3  Handbag Crossbody bag Style 46672          761\n4  Handbag Crossbody bag Style 46724          651\n5  Handbag Crossbody bag Style 49873          536\n6  Handbag Crossbody bag Style 51977          521\n7  Handbag Crossbody bag Style 50173          517\n8  Handbag Crossbody bag Style 36694          435\n9  Handbag Crossbody bag Style 51990          424\n\"\n",
        sleep: randomInt(24)
      }
    },
  },
};

export const graph_data_stream2: GraphData = {
  version: 0.5,
  nodes: {
    user_query: {
      agent: "streamMockAgent",
      params: {
        message: "Who is Bruce Springsteen and why is he famous?",
        sleep: randomInt(37),
      }
    },
    gpt_4o: {
      agent: "streamMockAgent",
      inputs: { array: [":user_query"] },
      params: {
        message: "Model name: `gpt-4o`\nResponse: Bruce Springsteen, often referred to as 'The Boss', is an American singer-songwriter and musician known for his work with the E Street Band. Born on September 23, 1949, in Long Branch, New Jersey, Springsteen is renowned for his poetic lyrics, energetic stage performances, and his ability to capture the essence of American life in his music. Some of his most famous albums include Born to Run, Darkness on the Edge of Town, and Born in the U.S.A. He has won numerous awards, including multiple Grammy Awards, and is considered one of the most influential rock musicians of his generation.",
        sleep: randomInt(27),
      },
    },
    mixtral_8x7b_32768: {
      agent: "streamMockAgent",
      inputs: { array: [":user_query"] },
      params: {
        message: "Bruce Springsteen is an iconic American singer, songwriter, and musician widely regarded as one of the most influential figures in rock music. Often referred to as \"The Boss,\" Springsteen has earned acclaim for his poetic lyrics, energetic performances, and enduring contributions to the music industry.",
        sleep: randomInt(12),
      },
    },
    llama3_2_1b: {
      agent: "streamMockAgent",
      inputs: { array: [":user_query"] },
      params: {
        message: "Bruce Springsteen is an American musician known for his rock music. He became famous in the 1970s and 1980s with songs like \"Born to Run\" and \"Born in the U.S.A.\" He often writes about American life and working-class struggles. His concerts are energetic and popular. He has won many awards, including Grammys, and is considered an important figure in rock music. People like him for his storytelling and connection to real-life issues.",
        sleep: randomInt(25),
      },
    },
    jury: {
     agent: "streamMockAgent",
     inputs: { array: [":gpt_4o", ":mixtral_8x7b_32768", ":llama3_2_1b"] },
     params: {
       message: "GPT-4o\n\nScore: 7/10\n\nReasoning\n\nThe response accurately describes Springsteen, including details such as his well-known and iconic nickname, concise biographical information about his career and life, as well as a general description of his musical and lyrical style.\n\nMixtral-8x7b-32678:\n\nScore\n\n4/10\n\nnWhile accurate, this response lacks detail, failing to list any of his hit songs or much information about him.\n\nLlama-3.2-1b:\n\nScore:\n\n5/10\n\nWhile accurate, this model also is also lacking in detail, using such generalities as him being known for 'rock music'. It does, however, list some of his most famous songs, giving it a higher score than Mixtral.",
       sleep: randomInt(22),
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