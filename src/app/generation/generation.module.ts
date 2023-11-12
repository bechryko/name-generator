import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { SidenavComponent } from '@core/components';
import { GenerationRoutingModule } from './generation-routing.module';
import { GenerationComponent } from './generation.component';
import { GenerationConfigComponent } from './generation-config/generation-config.component';
import { GenerationOutputComponent } from './generation-output/generation-output.component';


@NgModule({
  declarations: [
    GenerationComponent,
    GenerationConfigComponent,
    GenerationOutputComponent
  ],
  imports: [
    CommonModule,
    GenerationRoutingModule,
    MatGridListModule,
    SidenavComponent
  ]
})
export class GenerationModule { }
