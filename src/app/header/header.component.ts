import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrls } from '@ngen-core/enums';
import { AuthService } from '@ngen-core/services/auth.service';
import { Observable } from 'rxjs';

interface NavMenuItem {
   label: string;
   path: string;
}

@Component({
   selector: 'ngen-header',
   templateUrl: './header.component.html',
   styleUrl: './header.component.scss'
})
export class HeaderComponent {
   public readonly navMenuItems: NavMenuItem[] = [
      { label: 'Generation', path: RouteUrls.GENERATION },
      { label: 'Database', path: RouteUrls.DATABASE },
      { label: 'About', path: RouteUrls.ABOUT }
   ];
   public isDeveloperLoggedIn$: Observable<boolean>;

   constructor(
      private readonly router: Router,
      private readonly authService: AuthService
   ) {
      this.isDeveloperLoggedIn$ = this.authService.developerLoggedIn$;
   }

   public navigateTo(path: string): void {
      this.router.navigateByUrl(path);
   }
}
