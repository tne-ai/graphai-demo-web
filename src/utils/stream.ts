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


