<template>
  <div class="home">
    <div class="items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <div class="w-full h-96 bg-white rounded-md mt-4 mx-auto">
        <div ref="cyRef" class="w-full h-full" />
      </div>

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
import { defineComponent, ref, onMounted } from "vue";

import { GraphAI } from "graphai";
import { GraphData } from "graphai";
import { pushAgent, popAgent } from "graphai/lib/experimental_agents/array_agents";

import cytoscape, {
  //  ElementDefinition,
  //  ElementsDefinition,
  // Position,
  EventObject,
  Core,
  NodeSingular,
} from "cytoscape";
import fcose from "cytoscape-fcose";

cytoscape.use(fcose);

const layouts = ["grid", "cose", "random", "circle", "concentric", "fcose", "breadthfirst"];

const calcNodeWidth = (label: string) => {
  if (label === null || label === undefined) {
    return "50px";
  }
  return Math.max(50, label.length * 8) + "px";
};

const graph_data: GraphData = {
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

/*
const edges = [
  { data: { source: "id0", target: 1 } },
  { data: { source: "id0", target: 2 } },
  { data: { source: 1, target: 3, propId: "Sub" } },
  { data: { source: 1, target: 4, propId: "Sub" } },
  { data: { source: 1, target: 5, propId: "Sub" } },
  { data: { source: 4, target: 6, propId: "Sub" } },
  { data: { source: 4, target: 7, propId: "Sub" } },
];
*/

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const cyRef = ref();
    const layout_value = ref(layouts[0]);

    const res = ref({});
    const logs = ref<unknown[]>([]);
    let cy: null | Core = null;

    const run = async () => {
      const graph = new GraphAI(graph_data, { pushAgent, popAgent });
      graph.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        console.log();
      };
      const results = await graph.run();
      res.value = results;
    };

    const callback = (e: EventObject) => {
      console.log(e);
    };

    const createGraph = () => {
      try {
        cy = cytoscape({
          container: cyRef.value,
          style: [
            {
              selector: "node",
              style: {
                "background-color": "data(color)",
                label: "data(id)",
                shape: (ele: NodeSingular) => (ele.data("isStatic") ? "roundrectangle" : "rectangle"),
                width: (ele: NodeSingular) => calcNodeWidth(ele.data("id")),
                color: "#fff",
                height: "30px",
                "text-valign": "center",
                "text-halign": "center",
                "font-size": "12px",
              },
            },
            {
              selector: "edge",
              style: {
                width: 3,
                "line-color": "#888",
                "target-arrow-color": "#888",
                "target-arrow-shape": "triangle",
                label: "data(propId)",
                "curve-style": "unbundled-bezier",
                "text-background-color": "#ffffff",
                "text-background-opacity": 0.8,
                "text-background-shape": "rectangle",
                "font-size": "10px",
              },
            },
          ],
          layout: {
            name: "cose",
            fit: true,
            padding: 30,
            avoidOverlap: true,
          },
        });
        cy.on("mouseup", callback);
        cy.on("touchend", callback);
        cy.on("select", "node", callback);
        cy.on("select", "edge", callback);
        //store.commit("setCytoscape", cy);
      } catch (error) {
        console.error(error);
        // store.commit("setCytoscape", null);
        // error_msg.value = `${error}`;
      }
    };
    const updateGraphData = async () => {
      const elements = Object.keys(graph_data.nodes).reduce((tmp: Record<string, any>, nodeId) => {
        const node: Record<string, any> = graph_data.nodes[nodeId];
        tmp.nodes.push({
          data: {
            id: nodeId,
            color: "#0ff",
          }
        });
        console.log(node.inputs);
        (node.inputs ?? []).forEach((input:string) => {
          const ids = input.split('.')
          tmp.edges.push({
            data: {
              source: ids[0],
              target: nodeId,
            }
          })
        });      
        return tmp;
      }, 
      { nodes:[], edges:[]});
      console.log(elements.nodes);
      console.log(elements.edges);
      const cydata = { elements };

      if (cydata && cy) {
        cy.elements().remove();
        cy.add(cydata.elements);
        const name = cydata.elements.nodes.reduce((name: string, node: Record<string, any>) => {
          if (node.position) {
            return "preset";
          }
          return name;
        }, "cose");
        cy.layout({ name }).run();
        cy.fit();
        if (name == "cose") {
          // await sleep(400);
          // emit_positions();
        }
      }
    };

    onMounted(() => {
      createGraph();
      updateGraphData();
    });

    return {
      run,
      logs,
      graph_data,
      res,
      cyRef,
      layout_value,
    };
  },
});
</script>
