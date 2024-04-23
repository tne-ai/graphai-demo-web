<template>
  <div class="home">
    <div class="items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <div>List</div>
      <div>
        {{ agentList["agents"] }}
      </div>
      <div>Graph Data</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ graph_data }}</textarea>
      </div>
      <div>
        <button class="border-2" @click="run">Run</button>
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

import { agentListApi, httpAgent } from "./utils";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const graph_data = {
      nodes: {
        echo: {
          agentId: "httpAgent",
          params: {
            agentId: "echoAgent",
            params: {
              message: "hello",
            },
          },
        },
        bypassAgent: {
          agentId: "httpAgent",
          inputs: ["echo"],
          params: {
            agentId: "bypassAgent",
          },
        },
        sleepAgent: {
          agentId: "httpAgent",
          inputs: ["echo"],
          params: {
            agentId: "sleeperAgent",
            params: {
              duration: 1000,
            },
          },
        },
        bypassAgent2: {
          agentId: "httpAgent",
          inputs: ["bypassAgent"],
          params: {
            agentId: "bypassAgent",
          },
        },
      },
    };

    const res = ref({});
    const logs = ref<unknown[]>([]);
    const run = async () => {
      const graph = new GraphAI(graph_data, { httpAgent });
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
