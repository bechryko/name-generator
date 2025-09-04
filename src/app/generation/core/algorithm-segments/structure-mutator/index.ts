//@index("./*", (f, _) => `export { ${_.pascalCase(f.name)}, ${_.pascalCase(f.name)}Config } from "${f.path}";`)
export { NameEndingApplier, NameEndingApplierConfig } from "./name-ending-applier";
//@endindex
