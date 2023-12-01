import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent, SidenavComponent } from '@ngen-core/components';
import { InteractiveIconComponent } from '@ngen-core/components/interactive-icon/interactive-icon.component';
import { StoreModule } from '@ngrx/store';
import { NgLetModule } from 'ng-let';
import { GenerationConfigComponent } from './generation-config/generation-config.component';
import { configurationFeature } from './generation-config/store';
import { GenerationOutputComponent } from './generation-output/generation-output.component';
import { GenerationRoutingModule } from './generation-routing.module';
import { GenerationComponent } from './generation.component';
import { GeneratorAlgorithmsModule } from './generator-algorithms';
import { ConfigurationStoreService } from './services';

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
      GeneratorAlgorithmsModule,
      StoreModule.forFeature(configurationFeature),
      NgLetModule,
      InteractiveIconComponent
   ],
   providers: [
      ConfigurationStoreService
   ]
})
export class GenerationModule { }
