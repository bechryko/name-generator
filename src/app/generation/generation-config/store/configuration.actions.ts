import { Generators } from "@ngen-generation/enums";
import { GenerationConfig } from "@ngen-generation/models";
import { createActionGroup, props } from "@ngrx/store";

export const configurationActions = createActionGroup({
   source: "Configuration",
   events: {
      "Save": props<{ generator: Generators; config: GenerationConfig }>()
   }
});
