//@index("./*", (f, _) => `export { ${_.camelCase(f.name)} } from "${f.path}";`)
export { japaneseGeneratorAlgorithm } from "./japanese-generator.algorithm";
export { phoneticGeneratorAlgorithm } from "./phonetic-generator.algorithm";
export { regularGeneratorAlgorithm } from "./regular-generator.algorithm";
export { syllabicGeneratorAlgorithm } from "./syllabic-generator.algorithm";
//@endindex
