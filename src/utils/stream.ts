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

// stream2

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

export const useGraphData = (theMessage: string) => {
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

  const graphdata_any = {
    version: 0.2,
    nodes: {
      message: {
        value: theMessage,
      },
      source: {
        agent: (message: string) => {
          return new WordStreamer(message);
        },
        inputs: ["message"],
      },
      destination: {
        agent: faucat,
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
