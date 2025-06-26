//@index("./*", (f, _) => `export { ${_.pascalCase(f.name.split(".")[0])} } from "${f.path}";`)
export { AlgorithmDataType } from "./algorithm-data-type";
export { AlgorithmSegment } from "./algorithm-segment";
export { GenerationData } from "./generation-data.d";
export { NameGeneratorAlgorithm } from "./name-generator-algorithm";
//@endindex
