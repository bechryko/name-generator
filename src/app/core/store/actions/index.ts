//@index('./*', (f, _) => `export { ${_.camelCase(f.name)} } from '${f.path}';`)
export { authActions } from './auth.actions';
export { pageActions } from './page.actions';
//@endindex
