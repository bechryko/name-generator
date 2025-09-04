//@index("./*", (f, _) => `export { ${_.pascalCase(f.name)}, ${_.pascalCase(f.name)}Config } from "${f.path}";`)
export { JapaneseLetterAssembler, JapaneseLetterAssemblerConfig } from "./japanese-letter-assembler";
export { PhoneticWordGenerator, PhoneticWordGeneratorConfig } from "./phonetic-word-generator";
//@endindex
