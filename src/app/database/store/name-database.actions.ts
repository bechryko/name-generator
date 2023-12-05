import { GeneratedName } from "@ngen-database/models";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const nameDatabaseActions = createActionGroup({
   source: "Name Database",
   events: {
      "Add name": props<GeneratedName>(),
      "Add name success": props<GeneratedName>(),
      "Add name failure": props<{ error: any }>(),
      "Duplicate name failure": props<{ name: string }>(),
      "Delete name": props<{ name: string }>(),
      "Delete name success": props<{ name: string }>(),
      "Delete name failure": props<{ error: any }>(),
      "Sync names": emptyProps(),
      "Sync names success": props<{ names: GeneratedName[] }>(),
      "Sync names failure": props<{ error: any }>()
   }
});
