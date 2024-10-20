<template>
  <div class="home">
    <div class="items-center justify-center">
      <div>
        <div class="w-10/12 h-96 bg-white rounded-md mt-4 mx-auto border-2">
          <div ref="cytoscapeRef" class="w-full h-full" />
        </div>
      </div>
      <div class="mt-2">
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="run">Run</button>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="logClear">Clear</button>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="saveLayoutCytoscape">Save</button>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="loadLayoutCytoscape">Load</button>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="toggleZoom">
          Zoom({{ zoomingEnabled }})
        </button>
      </div>

      <div>
        <select v-model="selectedGraphIndex" class="border rounded-md p-2 m-2">
          <option v-for="(option, index) in graphDataSet" :value="index" :key="index">
            {{ option.name }}
          </option>
        </select>
      </div>

      <div v-if="selectedGraphName === 'jury'">
        <div>streamData</div>
        <div class="w-10/12 m-auto">
          <textarea class="border-2 p-2 w-full" rows="20">{{ streamData }}</textarea>
        </div>
      </div>

      <div v-if="selectedGraphName === 'insight_edge'">
        <div>streamData</div>
        <div class="w-10/12 m-auto">
          <textarea class="border-2 p-2 w-full" rows="20">{{ streamData }}</textarea>
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

import { GraphAI } from "graphai";
import * as agents from "@graphai/vanilla";
import { agentInfoWrapper } from "graphai/lib/utils/utils";

import { sleepTestAgent, httpAgent, slashGPTFuncitons2TextAgent } from "@/utils/agents";
import { graph_data_stream, graph_data_stream2 } from "@/utils/graph_data";

import { useStreamData } from "@/utils/stream";

// import { useCytoscape } from "@receptron/graphai_vue_cytoscape";
import { useCytoscape } from "../utils/cytoscape";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const graphDataSet = [
      { name: "jury", data: graph_data_stream2},
      { name: "insight_edge", data: graph_data_stream },
    ];

    const selectedGraphIndex = ref(0);
    const selectedGraph = computed(() => {
      return graphDataSet[selectedGraphIndex.value].data;
    });
    const selectedGraphName = computed(() => {
      return graphDataSet[selectedGraphIndex.value].name;
    });

    const { updateCytoscape, cytoscapeRef, resetCytoscape, layoutCytoscape, loadLayout, zoomingEnabled } = useCytoscape(selectedGraph);

    const { streamData, streamAgentFilter } = useStreamData();

    const agentFilters = [
      {
        name: "streamAgentFilter",
        agent: streamAgentFilter,
      },
    ];

    const graphaiResponse = ref({});
    const logs = ref<unknown[]>([]);

    const run = async () => {
      const graphai = new GraphAI(
        selectedGraph.value,
        {
          ...agents,
          sleepTestAgent: agentInfoWrapper(sleepTestAgent),
          httpAgent: agentInfoWrapper(httpAgent),
          slashGPTFuncitons2TextAgent: agentInfoWrapper(slashGPTFuncitons2TextAgent),
        },
        { agentFilters },
      );
      graphai.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        updateCytoscape(nodeId, state);
        console.log(nodeId, state);
      };
      const results = await graphai.run();
      graphaiResponse.value = results;
    };
    const logClear = () => {
      logs.value = [];
      resetCytoscape();
    };

    const saveLayoutCytoscape = () => {
      layoutCytoscape(selectedGraphName.value);
    };
    const loadLayoutCytoscape = () => {
      loadLayout(selectedGraphName.value);
    };
    const toggleZoom = () => {
      zoomingEnabled.value = !zoomingEnabled.value;
    };

    return {
      run,
      logs,
      logClear,
      graphaiResponse,
      cytoscapeRef,
      selectedGraphIndex,
      selectedGraphName,
      selectedGraph,
      graphDataSet,
      streamData,
      saveLayoutCytoscape,
      loadLayoutCytoscape,
      toggleZoom,
      zoomingEnabled,
    };
  },
});
</script>
