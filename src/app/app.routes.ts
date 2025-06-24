import { Routes } from "@angular/router";
import { RouteUrl } from "@ngen-shared/enums";

export const routes: Routes = [
   {
      path: "",
      redirectTo: RouteUrl.GENERATION,
      pathMatch: "full"
   },
   {
      path: RouteUrl.GENERATION,
      loadComponent: () => import("./generation/generation.component").then(c => c.GenerationComponent)
   },
   {
      path: RouteUrl.ABOUT,
      children: [
         {
            path: "",
            loadChildren: () => import("./about/about.module").then(m => m.AboutModule)
         }
      ]
   },
   {
      path: "**",
      redirectTo: RouteUrl.GENERATION
   }
];
