import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { Router } from "@angular/router";
import { APP_NAME } from "@ngen-core/constants";
import { RouteUrl } from "@ngen-core/enums";

interface NavMenuItem {
   label: string;
   path: string;
}

@Component({
   selector: "ngen-header",
   templateUrl: "./header.component.html",
   styleUrl: "./header.component.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [MatButton]
})
export class HeaderComponent {
   private readonly router = inject(Router);

   public readonly APP_NAME = APP_NAME;
   public readonly navMenuItems: NavMenuItem[] = [
      { label: "Generation", path: RouteUrl.GENERATION },
      { label: "About", path: RouteUrl.ABOUT }
   ];

   public navigateTo(path: string): void {
      this.router.navigateByUrl(path);
   }
}
