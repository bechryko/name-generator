import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent, SidenavComponent } from '@ngen-core/components';
import { GenerationConfigComponent } from './generation-config/generation-config.component';
import { GenerationOutputComponent } from './generation-output/generation-output.component';
import { GenerationRoutingModule } from './generation-routing.module';
import { GenerationComponent } from './generation.component';
import { GeneratorAlgorithmsModule } from './generator-algorithms';

@NgModule({
  declarations: [
    GenerationComponent,
    GenerationConfigComponent,
    GenerationOutputComponent
  ],
  imports: [
    CommonModule,
    GenerationRoutingModule,
    ReactiveFormsModule,
    InputComponent,
    MatButtonModule,
    SidenavComponent,
    GeneratorAlgorithmsModule
  ]
})
export class GenerationModule { }
