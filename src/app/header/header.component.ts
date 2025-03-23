import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { APP_NAME } from "@ngen-core/constants";
import { RouteUrls } from "@ngen-core/enums";

interface NavMenuItem {
   label: string;
   path: string;
}

@Component({
   selector: "ngen-header",
   templateUrl: "./header.component.html",
   styleUrl: "./header.component.scss"
})
export class HeaderComponent {
   public readonly APP_NAME = APP_NAME;
   public readonly navMenuItems: NavMenuItem[] = [
      { label: "Generation", path: RouteUrls.GENERATION },
      { label: "Database", path: RouteUrls.DATABASE },
      { label: "About", path: RouteUrls.ABOUT }
   ];

   constructor(private readonly router: Router) {}

   public navigateTo(path: string): void {
      this.router.navigateByUrl(path);
   }
}
