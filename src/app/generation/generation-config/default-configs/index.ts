//@index('./*', (f, _) => `export { ${_.camelCase(f.name)} } from '${f.path}';`)
export { basicDefaultConfig } from './basic-default-config';
export { japaneseDefaultConfig } from './japanese-default-config';
export { regularDefaultConfig } from './regular-default-config';
export { syllabicDefaultConfig } from './syllabic-default-config';
//@endindex
