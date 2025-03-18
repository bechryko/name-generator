//@index('./*', (f, _) => `export { ${_.pascalCase(f.name)} } from '${f.path}';`)
export { FirestoreService } from './firestore.service';
export { NameDatabaseService } from './name-database.service';
//@endindex
