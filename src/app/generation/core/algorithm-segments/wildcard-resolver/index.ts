//@index("./*", (f, _) => `export { ${_.pascalCase(f.name)}, ${_.pascalCase(f.name)}Config } from "${f.path}";`)
export { ProximityWildcardResolver, ProximityWildcardResolverConfig } from "./proximity-wildcard-resolver";
export { ScenarioWildcardResolver, ScenarioWildcardResolverConfig } from "./scenario-wildcard-resolver";
//@endindex
