//@index('./*', (f, _) => `export { ${_.pascalCase(f.name)} } from '${f.path}';`)
export { AppState } from './app.state';
export { AuthState } from './auth.state';
export { PageState } from './page.state';
//@endindex
