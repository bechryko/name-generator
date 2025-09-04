//@index("./*", (f, _) => `export { ${_.pascalCase(f.name)}, ${_.pascalCase(f.name)}Config } from "${f.path}";`)
export {
   SyllabicRegularStructureGenerator,
   SyllabicRegularStructureGeneratorConfig
} from "./syllabic-regular-structure-generator";
export {
   TemplateBasedRegularStructureGenerator,
   TemplateBasedRegularStructureGeneratorConfig
} from "./template-based-regular-structure-generator";
//@endindex
