import { NgModule } from "@angular/core";
import { NameDatabaseEffects, nameDatabaseFeature } from "@ngen-database/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { pageFeature } from "./features";

@NgModule({
   declarations: [],
   imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      StoreModule.forFeature(pageFeature),
      StoreModule.forFeature(nameDatabaseFeature),
      EffectsModule.forFeature(NameDatabaseEffects)
   ]
})
export class NgenStoreModule {}
