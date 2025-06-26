//@index("./*", (f, _) => `export { ${_.camelCase(f.name)} } from "${f.path}";`)
export { regularGeneratorAlgorithm } from "./regular-generator.algorithm";
export { syllabicGeneratorAlgorithm } from "./syllabic-generator.algorithm";
//@endindex
