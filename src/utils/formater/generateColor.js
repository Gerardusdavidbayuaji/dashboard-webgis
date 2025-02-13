// const generateColor = (id) => {
//   const colors = [
//     "#1f77b4",
//     "#ff7f0e",
//     "#2ca02c",
//     "#d62728",
//     "#9467bd",
//     "#8c564b",
//     "#e377c2",
//     "#7f7f7f",
//     "#bcbd22",
//     "#17becf",
//     "#aec7e8",
//     "#ffbb78",
//     "#98df8a",
//     "#ff9896",
//     "#c5b0d5",
//     "#c49c94",
//     "#f7b6d2",
//     "#c7c7c7",
//     "#dbdb8d",
//     "#9edae5",
//     "#393b79",
//     "#637939",
//     "#8c6d31",
//     "#843c39",
//     "#7b4173",
//     "#5254a3",
//     "#bd9e39",
//     "#e7ba52",
//     "#ad494a",
//     "#a55194",
//     "#ce6dbd",
//     "#7f2704",
//     "#d6616b",
//     "#e7969c",
//     "#de9ed6",
//     "#3182bd",
//     "#6baed6",
//     "#9ecae1",
//     "#c6dbef",
//   ];
//   return colors[id % colors.length];
// };

// export default generateColor;

const generateColor = (id) => {
  return id === "4" ? "#eab630" : "#374774";
};

export default generateColor;
