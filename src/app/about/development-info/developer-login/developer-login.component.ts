import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'ngen-developer-login',
  templateUrl: './developer-login.component.html',
  styleUrl: './developer-login.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ]
})
export class DeveloperLoginComponent {
  public passwordFormControl: FormControl;
  public isDeveloperLoggedIn$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService
  ) {
    this.passwordFormControl = new FormControl('', Validators.required);
    this.isDeveloperLoggedIn$ = authService.developerLoggedIn$;
  }

  public login(): void {
    this.authService.login(this.passwordFormControl.value);
  }

  public logout(): void {
    this.authService.logout();
  }
}
