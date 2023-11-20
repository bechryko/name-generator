import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteUrls } from '@ngen-core/enums';

const routes: Routes = [
  {
    path: '',
    redirectTo: RouteUrls.GENERATION,
    pathMatch: 'full'
  },
  { 
    path: RouteUrls.GENERATION, 
    loadChildren: () => import('./generation/generation.module').then(m => m.GenerationModule)
  },
  { 
    path: RouteUrls.ABOUT, 
    children: [
      {
        path: '',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: RouteUrls.GENERATION
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
