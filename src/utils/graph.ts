const arrays = (num: number) => {
  return new Array(num).fill(undefined);
};
const randomInt = (num: number) => {
  return Math.floor(Math.random() * num);
}
export const generateGraph = () => {
  const nodes = {};
  const inputsNode = [];
  arrays(10).forEach((__i, k) =>  {
    const name = "static_" + k;
    inputsNode.push(name);
    nodes[name] = {
      value: name,
    };
  });

  arrays(50).forEach((__i, k) =>  {
    const name = "node_" + k;
    
    const inputs = arrays(randomInt(4)).map(() => {
      const rand = randomInt(inputsNode.length);
      // console.log(
      return inputsNode[rand];
    });
    nodes[name] = {
      agentId: "sleepTestAgent",
      params: {
        duration: randomInt(10) * 400,
      },
      inputs,
    };
    inputsNode.push(name);
  });

  return {
    nodes,
  };
};
