<template>
  <div class="home">
    <div class="items-center justify-center">
      <div>
        <div class="w-10/12 h-96 bg-white rounded-md mt-4 mx-auto border-2">
          <div ref="cytoscapeRef" class="w-full h-full" />
        </div>
      </div>
      {{ messages }}
      <div class="mt-2">
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="run">Run</button>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="logClear">Clear</button>
      </div>

      <div>
        <div class="w-10/12 m-auto">
          <div v-if="inputPromise.length > 0">Write message to bot!!</div>
          <input v-model="userInput"  class="border-2 p-2 w-full" >
          <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="submit">Hello</button>
        </div>
      </div>
      <div>
        <div>streamData</div>
        <div class="w-10/12 m-auto">
          <textarea class="border-2 p-2 w-full" rows="10">{{ streamData }}</textarea>
        </div>
      </div>

      <div class="mt-2">Graph Data</div>
      <div class="w-10/12 m-auto">
        <textarea class="border-2 p-2 w-full" rows="20">{{ selectedGraph }}</textarea>
      </div>
      <div>Result</div>
      <div class="w-10/12 m-auto">
        <textarea class="border-2 p-2 w-full" rows="20">{{ graphaiResponse }}</textarea>
      </div>
      <div>Log</div>
      <div class="w-10/12 m-auto">
        <textarea class="border-2 p-2 w-full" rows="20">{{ logs }}</textarea>
      </div>

      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import { GraphAI, AgentFunction } from "graphai";
import * as agents from "@graphai/vanilla";
import { agentInfoWrapper } from "graphai/lib/utils/utils";

import { sleepTestAgent, httpAgent, slashGPTFuncitons2TextAgent } from "@/utils/agents";
import { graphChat } from "@/utils/graph_data";
import { openAIAgent } from "@graphai/openai_agent";

import { useStreamData } from "@/utils/stream";

// import { useCytoscape } from "../utils/cytoscape";


export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const userInput = ref("");
    
    const selectedGraph = computed(() => {
      return graphChat;
    });

    const inputPromise = ref<((message: string) => void)[]>([]);
    const submit = () => {
      if (inputPromise.value.length > 0) {
        const task = inputPromise.value.shift();
        if (task) {
          task(userInput.value);
          userInput.value = "";
        }
      }
    };
    const textPromise = () => {
      return new Promise((resolved) => {
        const task = (message: string) => {
          resolved(message);
        };
        inputPromise.value.push(task)
      })
    };
    
    const textInputAgent: AgentFunction = async (__context) => {
      const result = await textPromise();
      console.log(result);
      return result as string;
    }
    
    // const { updateCytoscape, cytoscapeRef, resetCytoscape } = useCytoscape(selectedGraph);

    const { streamData, streamAgentFilter } = useStreamData();

    const agentFilters = [
      {
        name: "streamAgentFilter",
        agent: streamAgentFilter,
      },
    ];
    const messages = ref<unknown[]>([]);
    const graphaiResponse = ref({});
    const logs = ref<unknown[]>([]);

    const run = async () => {
      const graphai = new GraphAI(
        selectedGraph.value,
        {
          ...agents,
          openAIAgent,
          sleepTestAgent: agentInfoWrapper(sleepTestAgent),
          httpAgent: agentInfoWrapper(httpAgent),
          slashGPTFuncitons2TextAgent: agentInfoWrapper(slashGPTFuncitons2TextAgent),
          textInputAgent: agentInfoWrapper(textInputAgent),
        },
        { agentFilters },
      );
      graphai.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        // updateCytoscape(nodeId, state);
        console.log(nodeId, state, result);
        if (nodeId === "reducer" && state === "completed" && result) {
          messages.value = result as unknown[];
        }
      };
      const results = await graphai.run();
      graphaiResponse.value = results;
    };
    const logClear = () => {
      logs.value = [];

      // resetCytoscape();
    };

    return {
      run,
      logs,
      logClear,
      graphaiResponse,
      // cytoscapeRef,
      selectedGraph,
      streamData,

      submit,
      userInput,
      messages,
      inputPromise,
    };
  },
});
</script>
