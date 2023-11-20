import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutSubpages } from './about-subpages';
import { AboutComponent } from './about.component';
import { DevelopmentInfoComponent } from './development-info/development-info.component';
import { GeneratorInfoComponent } from './generator-info/generator-info.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { VersionHistoryComponent } from './version-history/version-history.component';

const routes: Routes = [
  { 
    path: '', 
    component: AboutComponent,
    children: [
      {
        path: '',
        redirectTo: AboutSubpages.INTRODUCTION,
        pathMatch: 'full'
      },
      {
        path: AboutSubpages.INTRODUCTION,
        component: IntroductionComponent
      },
      {
        path: AboutSubpages.GENERATORS,
        component: GeneratorInfoComponent
      },
      {
        path: AboutSubpages.DEVELOPMENT,
        component: DevelopmentInfoComponent
      },
      {
        path: AboutSubpages.VERSIONS,
        component: VersionHistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
