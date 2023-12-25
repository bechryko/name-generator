import { Injectable } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import { ErrorMessageId, ErrorService } from "@ngen-core/error-handling";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from 'rxjs';
import { authActions } from "../actions";

@Injectable()
export class AuthEffects {
   public loginFailure$ = createEffect(() =>
      this.actions$.pipe(
         ofType(authActions.loginFailure),
         tap(action => this.errorService.popupError('auth', this.getLoginError(action.error)))
      ),
      { dispatch: false }
   );

   public logoutFailure$ = createEffect(() =>
      this.actions$.pipe(
         ofType(authActions.logoutFailure),
         tap(() => this.errorService.popupError('auth', 'LOGOUT_FAILURE'))
      ),
      { dispatch: false }
   );

   constructor(
      private readonly actions$: Actions,
      private readonly errorService: ErrorService
   ) { }

   private getLoginError(error: FirebaseError): ErrorMessageId<'auth'> {
      if(error.code !== "auth/invalid-login-credentials") {
         return 'LOGIN_FAILURE_TOO_MANY_ATTEMPTS';
      }
      return 'LOGIN_FAILURE_INVALID_PASSWORD';
   }
}