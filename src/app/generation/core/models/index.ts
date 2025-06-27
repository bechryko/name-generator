//@index("./*", (f, _) => `export { ${_.pascalCase(f.name.split(".")[0])} } from "${f.path}";`)
export { AlgorithmSegment } from "./algorithm-segment";
export { GenerationConfig } from "./generation-config.d";
export { GenerationData } from "./generation-data.d";
export { JapaneseLetter } from "./japanese-letter.d";
export { Letter } from "./letter.d";
export { NameGeneratorAlgorithm } from "./name-generator-algorithm";
export { RandomLetterConfig } from "./random-letter-config.d";
//@endindex
