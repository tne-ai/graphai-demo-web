<template>
  <div class="home">
    <div class="flex items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { GraphAI } from "graphai";

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
      const result = await response.json();
      return result;
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

    (async () => {
      const graph = new GraphAI(graph_data, { httpAgent });
      const results = await graph.run();
      console.log(results);
    })();
    return {};
  },
});
</script>
