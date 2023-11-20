import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SidenavComponent } from '@ngen-core/components';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { GeneratorInfoComponent } from './generator-info/generator-info.component';
import { DevelopmentInfoComponent } from './development-info/development-info.component';
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
    SidenavComponent
  ]
})
export class AboutModule { }
