<template>
  <div class="home">
    <div class="items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <div ref="cyRef" class="w-full h-full" />
      <div>Graph Data</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ graph_data }}</textarea>
      </div>
      <div>
        <button class="border-2" @click="run">Run</button>
      </div>
      <div>Result</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ res }}</textarea>
      </div>
      <div>Log</div>
      <div>
        <textarea class="border-8" rows="20" cols="100">{{ logs }}</textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { GraphAI } from "graphai";
import { pushAgent, popAgent } from "graphai/lib/experimental_agents/array_agents";

import cytoscape, {
  //  ElementDefinition,
  //  ElementsDefinition,
  // Position,
  // EventObject,
  // Core,
  // NodeSingular,
} from "cytoscape";
import fcose from "cytoscape-fcose";

cytoscape.use(fcose);

const graph_data = {
  loop: {
    while: "source",
  },
  nodes: {
    source: {
      value: ["orange", "banana", "lemon"],
      update: "popper.array",
    },
    result: {
      value: [],
      update: "reducer",
      isResult: true,
    },
    popper: {
      inputs: ["source"],
      agentId: "popAgent", // returns { array, item }
    },
    reducer: {
      agentId: "pushAgent",
      inputs: ["result", "popper.item"],
    },
  },
};

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const cyRef = ref();
    const res = ref({});
    const logs = ref<unknown[]>([]);
    
    const run = async () => {
      const graph = new GraphAI(graph_data, { pushAgent, popAgent });
      graph.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        console.log();
      };
      const results = await graph.run();
      res.value = results;
    };

    return {
      run,
      logs,
      graph_data,
      res,
      cyRef,
    };
  },
});
</script>
