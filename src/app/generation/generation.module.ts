import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidenavComponent } from '@core/components';
import { GenerationConfigComponent } from './generation-config/generation-config.component';
import { GenerationOutputComponent } from './generation-output/generation-output.component';
import { GenerationRoutingModule } from './generation-routing.module';
import { GenerationComponent } from './generation.component';
import { GeneratorAlgorithmsModule } from './generator-algorithms/generator-algorithms.module';

@NgModule({
  declarations: [
    GenerationComponent,
    GenerationConfigComponent,
    GenerationOutputComponent
  ],
  imports: [
    CommonModule,
    GenerationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    SidenavComponent,
    GeneratorAlgorithmsModule
  ]
})
export class GenerationModule { }
