import { GraphData } from "graphai";
import { randomInt } from "./graph";
export const graph_data_stream: GraphData = {
  version: 0.5,
  nodes: {
    user_query: {
      agent: "streamMockAgent",
      params: {
        message: "What is the total discount value of crossbody bags the last three months?",
        sleep: randomInt(30),
      },
    },
    generate_code: {
      agent: "streamMockAgent",
      inputs: { array: [":user_query"] },
      params: {
        message: "session = TNE(uid=UID, bucket_name=BUCKET, project=PROJECT, version=VERSION)\n\ndf = session.get_object(\"shopping_list_with_periods_cleaned.csv\")\n\ndf['Discount'] = (df['standard_selling_price'] - df['aur']) * df['sales']\n\ntotal_discount_value = df['Discount'].sum()\n\nresult = pd.DataFrame({\n'Total Discount Value': [total_discount_value]\n})\n\nreturn result\n",
        sleep: randomInt(27),
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
        sleep: randomInt(42)
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