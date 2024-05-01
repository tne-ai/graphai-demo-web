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
import { defineComponent, ref, onMounted } from "vue";

import { GraphAI } from "graphai";
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

const getTextColor = (bgColor = "#000000") => {
  const [r, g, b] = [0, 2, 4].map((start) => parseInt(bgColor.replace("#", "").substr(start, 2), 16));
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness < 40 ? "#ffffff" : "#000000";
};

const calcNodeWidth = (label: string) => {
  if (label === null || label === undefined) {
    return "50px";
  }
  return Math.max(50, label.length * 8) + "px";
};

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

const nodes = [{
  data: {
   id: 0,
   label: "Animal",
   description: "",
   active: true,
   width: 140,
  },
 },
 {
  data: {
   id: 1,
   label: "Mammal",
   description: "",
   active: false,
   width: 140,
  },
 },
 {
  data: {
   id: 2,
   label: "Reptile",
   description: "",
   active: false,
   width: 140,
  },
 },
 {
  data: {
   id: 3,
   label: "Horse",
   description: "",
   active: false,
   width: 140,
  },
 },
 {
  data: {
   id: 4,
   label: "Dog",
   description: "Join",
   active: false,
   width: 140,
  },
 },
 {
  data: {
   id: 5,
   label: "Goat",
   description: "Branch Out",
   active: false,
   width: 140,
  },
 },
 {
  data: {
   id: 6,
   label: "Hound",
   description: "",
   active: false,
   width: 140,
  },
 },
 {
  data: {
   id: 7,
   label: "German Shephard",
   description: "",
   active: false,
   width: 140,
  },
 },
];

const edges = [
  { data: { source: 0, target: 1, label: "Sub" } },
  { data: { source: 0, target: 2, label: "Sub" } },
  { data: { source: 1, target: 3, label: "Sub" } },
  { data: { source: 1, target: 4, label: "Sub" } },
  { data: { source: 1, target: 5, label: "Sub" } },
  { data: { source: 4, target: 6, label: "Sub" } },
  { data: { source: 4, target: 7, label: "Sub" } },
];

const cygraph = {
  elements: { nodes, edges }
};

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const cyRef = ref();
    const layout_value = ref(layouts[0]);
    const cydata = ref(cygraph);

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
    }

    const createGraph = () => {
      try {
        cy = cytoscape({
          container: cyRef.value,
          style: [
            {
              selector: "node",
              style: {
                "background-color": "#fff",
                label: "data(label)",
                "text-valign": "center",
                "text-halign": "center",
                shape: "rectangle",
                height: "50px",
                width: (ele: NodeSingular) => calcNodeWidth(ele.data("label")),
                color: (ele: NodeSingular) => getTextColor(ele.data("color")),
                "font-size": "12px",
              },
            },
            {
              selector: "edge",
              style: {
                width: 3,
                "line-color": "#888",
                "target-arrow-color": "#888",
                "target-arrow-shape": "none",
                label: "data(label)",
                "curve-style": "unbundled-bezier",
                "line-dash-pattern": [4, 4],
                "text-background-color": "#ffffff",
                "text-background-opacity": 1,
                "text-background-shape": "rectangle",
                "font-size": "10px",
              },
            },
            {
              selector: "edge[?directed]",
              style: {
                "target-arrow-shape": "triangle",
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
      if (cydata.value && cy) {
        cy.elements().remove();
        cy.add(cydata.value.elements);
        const name = cydata.value.elements.nodes.reduce((name, node) => {
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
