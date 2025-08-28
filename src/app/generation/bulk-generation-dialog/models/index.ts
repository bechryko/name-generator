//@index("./*", (f, _) => `export { ${_.pascalCase(f.name.split(".")[0])} } from "${f.path}";`)
export { BulkGenerationWorkerData } from "./bulk-generation-worker-data.d";
export { GeneratedName } from "./generated-name.d";
//@endindex
