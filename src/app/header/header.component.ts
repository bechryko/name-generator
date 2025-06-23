import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { Router } from "@angular/router";
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

   public readonly navMenuItems: NavMenuItem[] = [
      { label: "Generation", path: RouteUrl.GENERATION },
      { label: "About", path: RouteUrl.ABOUT }
   ];
   public readonly appTitle = document.title;

   public navigateTo(path: string): void {
      this.router.navigateByUrl(path);
   }
}
