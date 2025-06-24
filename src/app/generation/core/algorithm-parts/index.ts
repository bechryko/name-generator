//@index("./*", (f, _) => `export { ${_.pascalCase(f.name.split(".")[0])}, ${_.pascalCase(f.name.split(".")[0])}Config } from "${f.path}";`)
export { ProximityWildcardResolver, ProximityWildcardResolverConfig } from "./proximity-wildcard-resolver";
export {
   TemplateBasedRegularStructureGenerator,
   TemplateBasedRegularStructureGeneratorConfig
} from "./template-based-regular-structure-generator";
//@endindex
