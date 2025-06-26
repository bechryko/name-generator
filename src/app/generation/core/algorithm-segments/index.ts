//@index("./*", (f, _) => `export { ${_.pascalCase(f.name)}, ${_.pascalCase(f.name)}Config } from "${f.path}";`)
export { BasicLetterFinalizer, BasicLetterFinalizerConfig } from "./basic-letter-finalizer";
export { Capitalizer, CapitalizerConfig } from "./capitalizer";
export { NameEndingApplier, NameEndingApplierConfig } from "./name-ending-applier";
export { ProximityWildcardResolver, ProximityWildcardResolverConfig } from "./proximity-wildcard-resolver";
export {
   TemplateBasedRegularStructureGenerator,
   TemplateBasedRegularStructureGeneratorConfig
} from "./template-based-regular-structure-generator";
//@endindex
