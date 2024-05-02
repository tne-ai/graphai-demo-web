<template>
  <div class="home">
    <div class="items-center justify-center space-x-8">
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <div class="w-full h-96 bg-white rounded-md mt-4 mx-auto">
        <div ref="cyRef" class="w-full h-full" />
      </div>
      <div>
        <button class="border-2" @click="run">Run</button>
      </div>

      <div>Graph Data</div>
      <div class="w-6/8">
        <textarea class="border-8" rows="20" cols="100">{{ graph_data }}</textarea>
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

import { GraphAI, GraphData, AgentFunction } from "graphai";
import { NodeState, NodeData } from "graphai/lib/type";
import { pushAgent, popAgent } from "graphai/lib/experimental_agents/array_agents";
import { sleep } from "@/utils/utils";

import cytoscape, {
  //  ElementDefinition,
  //  ElementsDefinition,
  // Position,
  // EventObject,
  Core,
  NodeSingular,
  NodeDefinition,
  EdgeDefinition,
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

const colorMap = {
  [NodeState.Waiting]: "#888",
  [NodeState.Completed]: "#000",
  [NodeState.Executing]: "#0f0",
  [NodeState.Queued]: '#ff0',
  [NodeState.Injected]: "#ccc",
  [NodeState.TimedOut]: "#f0f",
  [NodeState.Failed]: "#f00",
  [NodeState.Dispatched]: "#f00", // obsolete
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

const graph_data2: GraphData = {
  nodes: {
    node1: {
      value: { message: "Hello World" }
    },
    node2: {
      agentId: "sleepTestAgent",
      inputs: ["node1"],
    },
    node3: {
      agentId: "sleepTestAgent",
      inputs: ["node2"],
    },
    node4: {
      agentId: "sleepTestAgent",
      inputs: ["node2", "node3"],
    },
    node5: {
      agentId: "sleepTestAgent",
      inputs: ["node3", "node4"],
    },
    node6: {
      agentId: "sleepTestAgent",
      inputs: ["node1", "node5"],
    },
    node7: {
      agentId: "sleepTestAgent",
      inputs: ["node3", "node5"],
    },
    node8: {
      agentId: "sleepTestAgent",
      inputs: ["node2", "node5", "node3"],
    },
    node9: {
      agentId: "sleepTestAgent",
      inputs: ["node4", "node8", "node6"],
    },
    node10: {
      agentId: "sleepTestAgent",
      inputs: ["node5", "node6", "node7"],
    },
    node11: {
      agentId: "sleepTestAgent",
      inputs: ["node3", "node6", "node7"],
    },
    node12: {
      agentId: "sleepTestAgent",
      inputs: ["node10", "node11", "node9"],
    },
  }
};

const cytoscapeFromGraph = (graph_data: GraphData) => {
  const elements = Object.keys(graph_data.nodes).reduce((tmp: { nodes: NodeDefinition[], edges: EdgeDefinition[], map: Record<string, NodeDefinition>}, nodeId) => {
      const node: NodeData = graph_data.nodes[nodeId];
      const cyNode = {
        data: {
          id: nodeId,
          color: colorMap[NodeState.Waiting],
          isStatic: "value" in node
        }
      };
      tmp.nodes.push(cyNode);
      tmp.map[nodeId] = cyNode;
      if ("inputs" in node) {
        // computed node
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
      } 
      if ("update" in node && node.update) {
        // static node
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

export const sleepTestAgent: AgentFunction<{ duration?: number}> = async (context) => {
  const { params, inputs } = context;
  await sleep(params?.duration ?? 500);
  return inputs[0];
};

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const cyRef = ref();
    const layout_value = ref(layouts[0]);
    const cytoData = ref(cytoscapeFromGraph(graph_data2));

    const res = ref({});
    const logs = ref<unknown[]>([]);
    let cy: null | Core = null;

    const run = async () => {
      const graph = new GraphAI(graph_data2, { pushAgent, popAgent, sleepTestAgent });
      graph.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
        logs.value.push({ nodeId, state, inputs, result, errorMessage });
        console.log();

        console.log(nodeId, state);
        const elements = cytoData.value.elements;
        elements.map[nodeId].data.color = colorMap[state];
        cytoData.value = { elements };
      };
      const results = await graph.run();
      res.value = results;
    };

    const storePositions = () => {
      console.log("storePositions");
      if (cy) {
        cy.nodes().forEach((cynode: NodeDefinition) => {
          const id = cynode.id();
          const pos = cynode.position();
          const node = cytoData.value.elements.map[id];
          node.position = pos;
        });
      }
    };

    const createCytoscope = () => {
      try {
        cy = cytoscape({
          container: cyRef.value,
          style: cyStyle as any,
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
      if (cy) {
        cy.elements().remove();
        cy.add(cytoData.value.elements as any);
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
      }
    };
    watch(cytoData, () => {
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
