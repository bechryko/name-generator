import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { authActions, authFeature } from '@ngen-core/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly developerLoggedIn$: Observable<boolean>;

  constructor(
    private readonly auth: Auth,
    private readonly store: Store
  ) {
    this.developerLoggedIn$ = this.store.select(authFeature.selectIsDeveloperLoggedIn);
  }

  public login(password: string): void {
    signInWithEmailAndPassword(this.auth, "dev@ngen.com", password)
      .then(_ => {
        this.store.dispatch(authActions.loginSuccess());
      })
      .catch(error => this.store.dispatch(authActions.loginFailure({ error })));
  }

  public logout(): void {
    this.auth.signOut()
      .then(_ => this.store.dispatch(authActions.logoutSuccess()))
      .catch((error: FirebaseError) => this.store.dispatch(authActions.logoutFailure({ error })));
  }

  public onApplicationStart(): void {
    console.log(this.auth.currentUser)
    if(this.auth.currentUser) {
      this.store.dispatch(authActions.loginSuccess());
    }
  }
}
