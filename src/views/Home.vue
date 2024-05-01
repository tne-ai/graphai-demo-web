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
import { defineComponent, ref, onMounted, watch } from "vue";

import { GraphAI } from "graphai";
import { GraphData } from "graphai";
import { pushAgent, popAgent } from "graphai/lib/experimental_agents/array_agents";
import { sleep } from "@/utils/utils";

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

const parseInput = (input:string) => {
  const ids = input.split('.')
  const source = ids.shift();
  const label = ids.length ? ids.join('.') : undefined;
  return { source, label };
};

const cyStyle = [{
    selector: "node",
    style: {
      "background-color": "data(color)",
      label: "data(id)",
      shape: (ele: NodeSingular) => (ele.data("isStatic") ? "rectangle" : "roundrectangle"),
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
      "curve-style": "unbundled-bezier",
      "text-background-color": "#ffffff",
      "text-background-opacity": 0.8,
      "text-background-shape": "rectangle",
      "font-size": "10px",
    },
  },
  {
    selector: "edge[label]",
    style: {
      label: "data(label)",
    }
  },
  {
    selector: "edge[isUpdate]",
    style: {
      "color": "#ddd",
      "line-color": "#ddd",
      "line-style": "dashed",
      "target-arrow-color": "#ddd",
    }
  },
];

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

const cytoscapeFromGraph = (graph_data: GraphData) => {
  const elements = Object.keys(graph_data.nodes).reduce((tmp: Record<string, any>, nodeId) => {
      const node: Record<string, any> = graph_data.nodes[nodeId];
      const cyNode = {
        data: {
          id: nodeId,
          color: "#888",
          isStatic: "value" in node
        }
      };
      tmp.nodes.push(cyNode);
      tmp.map[nodeId] = cyNode;
      (node.inputs ?? []).forEach((input:string) => {
        const { source, label } = parseInput(input);
        tmp.edges.push({
          data: {
            source,
            target: nodeId,
            label
          }
        })
      });
      if (node.update) {
        const { source, label } = parseInput(node.update);        
        tmp.edges.push({
          data: {
            source,
            target: nodeId,
            isUpdate: true,
            label
          }
        })
      }
      return tmp;
    }, 
    { nodes:[], edges:[], map:{} } 
  );
  return { elements };
}

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const cyRef = ref();
    const layout_value = ref(layouts[0]);
    const cytoData = ref(cytoscapeFromGraph(graph_data));

    const res = ref({});
    const logs = ref<unknown[]>([]);
    let cy: null | Core = null;

    const run = async () => {
      const graph = new GraphAI(graph_data, { pushAgent, popAgent });
      graph.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        console.log();

        console.log(nodeId, state);
        const elements = cytoData.value.elements;
        elements.map[nodeId].data.color = "#f00";
        cytoData.value = { elements };
      };
      const results = await graph.run();
      res.value = results;
    };

    const storePositions = () => {
      console.log("storePositions");
      cy.nodes().forEach((cynode:any) => {
        const id = cynode.id();
        const pos = cynode.position();
        const node = cytoData.value.elements.map[id];
        node.position = pos;
      });
    };

    const createCytoscope = () => {
      try {
        cy = cytoscape({
          container: cyRef.value,
          style: cyStyle,
          layout: {
            name: "cose",
            fit: true,
            padding: 30,
            avoidOverlap: true,
          },
        });
        cy.on("mouseup", storePositions);
        cy.on("touchend", storePositions);
        // cy.on("select", "node", callback);
        // cy.on("select", "edge", callback);
        //store.commit("setCytoscape", cy);
      } catch (error) {
        console.error(error);
        // store.commit("setCytoscape", null);
        // error_msg.value = `${error}`;
      }
    };
    const updateGraphData = async () => {
      cy.elements().remove();
      cy.add(cytoData.value.elements);
      const name = cytoData.value.elements.nodes.reduce((name: string, node: Record<string, any>) => {
        if (node.position) {
          return "preset";
        }
        return name;
      }, "cose");
      console.log("layout", name);
      cy.layout({ name }).run();
      cy.fit();
      if (name == "cose") {
        await sleep(400);
        storePositions();
      }
    };
    watch(cytoData, (newData) => {
      console.log("updated");
      updateGraphData();
    });

    onMounted(() => {
      createCytoscope();
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
