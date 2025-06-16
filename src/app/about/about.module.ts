import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SidebarComponent } from "@ngen-core/components";
import { NgLetModule } from "ng-let";
import { AboutRoutingModule } from "./about-routing.module";
import { AboutComponent } from "./about.component";
import { GeneratorInfoComponent } from "./generator-info/generator-info.component";
import { IntroductionComponent } from "./introduction/introduction.component";
import { VersionHistoryComponent } from "./version-history/version-history.component";

@NgModule({
   imports: [
      CommonModule,
      AboutRoutingModule,
      SidebarComponent,
      NgLetModule,
      AboutComponent,
      IntroductionComponent,
      GeneratorInfoComponent,
      VersionHistoryComponent
   ]
})
export class AboutModule {}
