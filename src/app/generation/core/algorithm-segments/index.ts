//@index("./*", (f, _) => `export { ${_.pascalCase(f.name)}, ${_.pascalCase(f.name)}Config } from "${f.path}";`)
export { BasicLetterFinalizer, BasicLetterFinalizerConfig } from "./basic-letter-finalizer";
export { Capitalizer, CapitalizerConfig } from "./capitalizer";
export { JapaneseLetterAssembler, JapaneseLetterAssemblerConfig } from "./japanese-letter-assembler";
export { NameEndingApplier, NameEndingApplierConfig } from "./name-ending-applier";
export { PhoneticWordGenerator, PhoneticWordGeneratorConfig } from "./phonetic-word-generator";
export { ProximityWildcardResolver, ProximityWildcardResolverConfig } from "./proximity-wildcard-resolver";
export {
   SyllabicRegularStructureGenerator,
   SyllabicRegularStructureGeneratorConfig
} from "./syllabic-regular-structure-generator";
export {
   TemplateBasedRegularStructureGenerator,
   TemplateBasedRegularStructureGeneratorConfig
} from "./template-based-regular-structure-generator";
//@endindex
