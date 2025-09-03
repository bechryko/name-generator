//@index("./*", (f, _) => `export { ${_.pascalCase(f.name.split(".")[0])} } from "${f.path}";`)
export { AlgorithmSegment } from "./algorithm-segment";
export { AvailableLetters } from "./available-letters.d";
export { GenerationConfig } from "./generation-config.d";
export { GenerationData } from "./generation-data.d";
export { GenerationErrors } from "./generation-errors";
export { JapaneseLetter } from "./japanese-letter.d";
export { NameGeneratorAlgorithm } from "./name-generator-algorithm";
export { ScenarioDescription } from "./scenario-description.d";
//@endindex
