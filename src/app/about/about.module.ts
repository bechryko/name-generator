import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidenavComponent } from '@ngen-core/components';
import { NgLetModule } from 'ng-let';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { DeveloperLoginComponent } from './development-info/developer-login/developer-login.component';
import { DevelopmentInfoComponent } from './development-info/development-info.component';
import { GeneratorInfoComponent } from './generator-info/generator-info.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { VersionHistoryComponent } from './version-history/version-history.component';


@NgModule({
   declarations: [
      AboutComponent,
      IntroductionComponent,
      GeneratorInfoComponent,
      DevelopmentInfoComponent,
      VersionHistoryComponent
   ],
   imports: [
      CommonModule,
      AboutRoutingModule,
      SidenavComponent,
      NgLetModule,
      DeveloperLoginComponent
   ]
})
export class AboutModule { }
