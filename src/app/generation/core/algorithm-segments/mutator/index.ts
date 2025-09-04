//@index("./*", (f, _) => `export { ${_.pascalCase(f.name)}, ${_.pascalCase(f.name)}Config } from "${f.path}";`)
export { Capitalizer, CapitalizerConfig } from "./capitalizer";
//@endindex
