<template>
  <div class="home">
    <div class="items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <div>List</div>
      <div class="hidden">
        {{ agentList["agents"]?.map((a) => a.agentId) }}
      </div>
      <div>Graph Data</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ graph_data }}</textarea>
      </div>
      <div>
        <button class="border-2" @click="run">Run!</button>
      </div>
      <div>
        <textarea class="border-8" rows="20" cols="100">{{ logs }}</textarea>
      </div>
      <div>Result</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ res }}</textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { GraphAI } from "graphai";
import { pushAgent, popAgent } from "graphai/lib/experimental_agents/array_agents";

import { agentListApi } from "./utils";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const graph_data = {
      version: 0.2,
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

    const res = ref({});
    const logs = ref<unknown[]>([]);
    const run = async () => {
      console.log("*** run");
      const graph = new GraphAI(graph_data, { pushAgent, popAgent });
      graph.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        console.log();
      };
      const results = await graph.run();
      res.value = results;
    };

    const agentList = ref<{ agents?: string[] }>({});
    const init = async () => {
      agentList.value = await agentListApi();
      console.log(agentList.value);
    };
    init();

    return {
      run,
      logs,
      graph_data,
      res,
      agentList,
    };
  },
});
</script>
