<template>
  <div class="home">
    <div class="items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <div>Graph Data</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ graph_data }}</textarea>
      </div>
      <button class="border-2" @click="run">Run</button>
      <div>Result</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ res }}</textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { GraphAI, AgentFunction } from "graphai";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const httpAgent: AgentFunction = async ({ inputs, params }) => {
      const { agentId, params: postParams } = params;
      const url = "https://graphai-demo.web.app/api/agents/" + agentId;

      const postData = { inputs, params: postParams };

      const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      return await response.json();
    };

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
    const run = async () => {
      const graph = new GraphAI(graph_data, { httpAgent });
      const results = await graph.run();
      res.value = results;
    };
    return {
      run,
      graph_data,
      res,
    };
  },
});
</script>
