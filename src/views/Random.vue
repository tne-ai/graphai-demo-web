<template>
  <div class="home">
    <div class="items-center justify-center">
      <div>
        <div class="w-10/12 h-96 bg-white rounded-md mt-4 mx-auto border-2">
          <div ref="cytoscopeRef" class="w-full h-full" />
        </div>
      </div>
      <div class="mt-2">
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="run">Run</button>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="logClear">Clear</button>
      </div>

      <div class="mt-2">
        <div>Static Node: <input type="number" class="border-2 rounded-md p-2" v-model="staticNode" /></div>
        <div>Dynamic Node: <input type="number" class="border-2 rounded-md p-2" v-model="computedNode" /></div>
        <div>Concurrency: <input type="number" class="border-2 rounded-md p-2" v-model="concurrency" /></div>
        <button class="text-white font-bold items-center rounded-full px-4 py-2 m-1 bg-sky-500 hover:bg-sky-700" @click="update">Update</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { GraphAI } from "graphai";
import { pushAgent, popAgent } from "graphai/lib/experimental_agents/array_agents";

import { sleepTestAgent, httpAgent } from "@/utils/agents";
import { generateGraph } from "@/utils/graph";

import { useCytoscope } from "@/composables/cytoscope";

// const layouts = ["grid", "cose", "random", "circle", "concentric", "fcose", "breadthfirst"];

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const staticNode = ref(20);
    const computedNode = ref(30);
    const concurrency = ref(8);

    const selectedGraph = ref(generateGraph(staticNode.value, computedNode.value));

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
    const update = () => {
      console.log("update");
      selectedGraph.value = generateGraph(staticNode.value, computedNode.value, concurrency.value);
    };
    return {
      run,
      logs,
      logClear,
      graphaiResponse,
      cytoscopeRef,
      selectedGraph,

      update,

      staticNode,
      computedNode,
      concurrency,
    };
  },
});
</script>
