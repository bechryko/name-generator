import { createFeature, createReducer, on } from "@ngrx/store";
import { authActions } from "../actions";
import { AuthState } from "../states";

const initialState: AuthState = {
   isDeveloperLoggedIn: false
};

export const authFeature = createFeature({
   name: "auth",
   reducer: createReducer(
      initialState,
      on(authActions.loginSuccess, state => ({
         ...state,
         isDeveloperLoggedIn: true
      })),
      on(authActions.logoutSuccess, state => ({
         ...state,
         isDeveloperLoggedIn: false
      }))
   )
});
