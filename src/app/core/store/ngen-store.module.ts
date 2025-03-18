import { NgModule } from '@angular/core';
import { NameDatabaseEffects, nameDatabaseFeature } from '@ngen-database/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './effects';
import { authFeature, pageFeature } from './features';

@NgModule({
   declarations: [],
   imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      StoreModule.forFeature(pageFeature),
      StoreModule.forFeature(nameDatabaseFeature),
      EffectsModule.forFeature(NameDatabaseEffects),
      StoreModule.forFeature(authFeature),
      EffectsModule.forFeature(AuthEffects),
   ]
})
export class NgenStoreModule { }
