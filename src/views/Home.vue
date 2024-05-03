<template>
  <div class="home">
    <div class="items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <div class="w-full h-96 bg-white rounded-md mt-4 mx-auto border-2">
        <div ref="cytoscopeRef" class="w-full h-full" />
      </div>
      <div class="mt-2">
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="run">Run</button>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="logClear">Clear</button>
      </div>

      <select v-model="selectedGraphIndex" class="border rounded-md p-2 m-2">
        <option v-for="(option, index) in graphDataSet" :value="index" :key="index">
          {{ option.name }}
        </option>
      </select>

      <div class="mt-2">Graph Data</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ selectedGraph }}</textarea>
      </div>
      <div>Result</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ graphaiResponse }}</textarea>
      </div>
      <div>Log</div>
      <div>
        <textarea class="border-8" rows="20" cols="100">{{ logs }}</textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import { GraphAI } from "graphai";
import { pushAgent, popAgent } from "graphai/lib/experimental_agents/array_agents";

import { sleepTestAgent, httpAgent } from "@/utils/agents";
import { generateGraph } from "@/utils/graph";
import { graph_data, graph_data2, graph_data_http } from "@/utils/graph_data";

import { useCytoscope } from "@/composables/cytoscope";

// const layouts = ["grid", "cose", "random", "circle", "concentric", "fcose", "breadthfirst"];
const graph_random = generateGraph();
const graphDataSet = [
  { name: "sample2", data: graph_data2 },
  { name: "sample", data: graph_data },
  { name: "random", data: graph_random },
  { name: "http", data: graph_data_http },
];

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const selectedGraphIndex = ref(0);
    const selectedGraph = computed(() => {
      return graphDataSet[selectedGraphIndex.value].data;
    });

    const { updateCytoscope, cytoscopeRef, resetCytoscope } = useCytoscope(selectedGraph);

    const graphaiResponse = ref({});
    const logs = ref<unknown[]>([]);

    const run = async () => {
      const graphai = new GraphAI(selectedGraph.value, { pushAgent, popAgent, sleepTestAgent, httpAgent });
      graphai.onLogCallback = async ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        updateCytoscope(nodeId, state);
        console.log(nodeId, state);
      };
      const results = await graphai.run();
      graphaiResponse.value = results;
    };
    const logClear = () => {
      logs.value = [];
      resetCytoscope();
    };

    return {
      run,
      logs,
      logClear,
      graphaiResponse,
      cytoscopeRef,
      selectedGraphIndex,
      selectedGraph,
      graphDataSet,
    };
  },
});
</script>
