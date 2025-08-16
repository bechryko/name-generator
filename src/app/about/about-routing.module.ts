import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutSubpage } from "./about-subpage";
import { AboutComponent } from "./about.component";
import { GeneratorInfoComponent } from "./generator-info/generator-info.component";
import { IntroductionComponent } from "./introduction/introduction.component";
import { VersionHistoryComponent } from "./version-history/version-history.component";

const routes: Routes = [
   {
      path: "",
      component: AboutComponent,
      children: [
         {
            path: "",
            redirectTo: AboutSubpage.INTRODUCTION,
            pathMatch: "full"
         },
         {
            path: AboutSubpage.INTRODUCTION,
            component: IntroductionComponent
         },
         {
            path: AboutSubpage.GENERATORS,
            component: GeneratorInfoComponent
         },
         {
            path: AboutSubpage.VERSIONS,
            component: VersionHistoryComponent
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class AboutRoutingModule {}
