import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Generators } from '@ngen-generation/enums';
import { configurationActions, configurationSelectors } from '@ngen-generation/generation-config/store';
import { GenerationConfig } from '@ngen-generation/models';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ConfigurationStoreService {
   private readonly storedConfigs: Record<Generators, BehaviorSubject<GenerationConfig>> = {} as any;

   constructor(
      private readonly store: Store
   ) {
      for (const generator of Object.values(Generators)) {
         this.storedConfigs[generator] = new BehaviorSubject<GenerationConfig>({} as any);
         this.store.select(configurationSelectors[generator]).pipe(
            takeUntilDestroyed()
         ).subscribe(this.storedConfigs[generator]);
      }
   }

   public saveConfig(generator: Generators, config: GenerationConfig): void {
      this.store.dispatch(configurationActions.save({ generator, config }));
   }

   public loadConfig(generator: Generators): GenerationConfig {
      return this.storedConfigs[generator].value;
   }
}

