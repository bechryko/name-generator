import { FirebaseError } from "@angular/fire/app";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const authActions = createActionGroup({
   source: "Auth",
   events: {
      "Login success": emptyProps(),
      "Login failure": props<{ error: FirebaseError }>(),
      "Logout success": emptyProps(),
      "Logout failure": props<{ error: FirebaseError }>()
   }
});
