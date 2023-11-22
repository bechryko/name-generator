import { AboutSubpages } from "@ngen-about/about-subpages";
import { Generators } from "@ngen-generation/enums";
import { createActionGroup, props } from "@ngrx/store";

export const pageActions = createActionGroup({
   source: "Pages",
   events: {
      "Set generator": props<{ generator: Generators }>(),
      "Set about subpage": props<{ subpage: AboutSubpages }>()
   }
});
