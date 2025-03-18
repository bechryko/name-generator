import { GeneratedName } from "@ngen-database/models";
import { createEntityAdapter } from "@ngrx/entity";
import { createFeature, createReducer, on } from "@ngrx/store";
import { nameDatabaseActions } from "./name-database.actions";

const nameDatabaseAdapter = createEntityAdapter<GeneratedName>({
   selectId: name => name.name
});

export const nameDatabaseFeature = createFeature({
   name: "nameDatabase",
   reducer: createReducer(
      nameDatabaseAdapter.getInitialState(),
      on(nameDatabaseActions.addNameSuccess, (state, { name, generationAlgorithm }) => 
         nameDatabaseAdapter.addOne({ name, generationAlgorithm, version: "pre-release" }, state)
      ),
      on(nameDatabaseActions.deleteNameSuccess, (state, { name }) => 
         nameDatabaseAdapter.removeOne(name, state)
      ),
      on(nameDatabaseActions.syncNamesSuccess, (state, { names }) => 
         nameDatabaseAdapter.setAll(names, state)
      )
   )
});
