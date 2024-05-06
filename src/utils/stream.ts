import { ref, Ref } from "vue";
import { AgentFilterFunction } from "graphai/lib/type";

export const useStreamData = () => {
  const streamData: Ref<Record<string, string>> = ref({});

  const outSideFunciton = (nodeId: string, token: string) => {
    streamData.value[nodeId] = (streamData.value[nodeId] || "") + token;
  };
  const streamAgentFilter: AgentFilterFunction = async (context, next) => {
    context.params.streamCallback = (token: string) => {
      outSideFunciton(context.debugInfo.nodeId, token);
    };
    return next(context);
  };

  return {
    streamData,
    streamAgentFilter,
  };
};

//

class WordStreamer {
  public onWord = (__word: string | undefined) => {};

  constructor(message: string) {
    const words = message.split(" ");
    const next = () => {
      setTimeout(() => {
        const word = words.shift();
        this.onWord(word);
        if (word) {
          next();
        }
      }, 500);
    };
    next();
  }
}

export const useFaucet = () => {
  const words = ref(new Array<string>());

  const faucat = (streamer: WordStreamer) => {
    return new Promise((resolve) => {
      streamer.onWord = (word: string | undefined) => {
        if (word) {
          words.value.push(word);
        } else {
          resolve(words.value.join(" "));
        }
      };
    });
  };
  return {
    words,
    faucat,
  };
};

export const useGraphData = () => {
  const { words, faucat } = useFaucet();
  const theMessage = "May the force be with you.";

  const graphdata_any = {
    version: 0.2,
    nodes: {
      message: {
        value: theMessage,
      },
      source: {
        agent: "functionAgent",
        params: {
          function: (message: string) => {
            return new WordStreamer(message);
          },
        },
        inputs: ["message"],
      },
      destination: {
        agent: "functionAgent",
        params: {
          function: faucat,
        },
        isResult: true,
        inputs: ["source"],
      },
    },
  };
  return {
    graphdata_any,
    words,
  };
};
