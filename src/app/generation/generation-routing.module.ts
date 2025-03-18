import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerationComponent } from './generation.component';

const routes: Routes = [{ path: '', component: GenerationComponent }];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class GenerationRoutingModule { }
