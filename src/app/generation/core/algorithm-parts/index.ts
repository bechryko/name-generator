//@index("./*", (f, _) => `export { ${_.pascalCase(f.name.split(".")[0])}, ${_.pascalCase(f.name.split(".")[0])}Config } from "${f.path}";`)
export {
   TemplateBasedRegularStructureGenerator,
   TemplateBasedRegularStructureGeneratorConfig
} from "./template-based-regular-structure-generator";
//@endindex
