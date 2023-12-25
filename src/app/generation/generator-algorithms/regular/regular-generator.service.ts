import { Injectable } from '@angular/core';
import { capitalize } from '@ngen-core/functions';
import { RegularName } from '@ngen-core/names';
import { RandomUtils } from '@ngen-core/utils';
import { GenerationConfig, RegularNameObject } from '@ngen-generation/models';
import { GeneratorAlgorithmsModule } from '../generator-algorithms.module';
import { GeneratorService } from '../generator-service.model';
import { LetterFinalizerService } from '../letter-finalization/letter-finalizer.service';
import { RegularUtils } from '../letter-finalization/utils';
import { matchNameEnding } from '../name-endings';
import { REGULAR_GENERATOR_VERSION } from './regular-generator-version';

@Injectable({
   providedIn: GeneratorAlgorithmsModule
})
export class RegularGeneratorService implements GeneratorService {
   public readonly version = REGULAR_GENERATOR_VERSION;

   constructor(
      private readonly letterFinalizerService: LetterFinalizerService
   ) { }

   public generateName(config: GenerationConfig): RegularName {
      if (!config.regularNameBase) {
         const length = RandomUtils.between(config.minLength, config.maxLength);
         const regularBase = new RegularNameObject(config.regularNameStart);
         for (let i = config.regularNameStart.length; i < length - config.regularNameEnd.length; i++) {
            regularBase.append(RegularUtils.symbols.wildcard);
         }
         regularBase.append(new RegularNameObject(config.regularNameEnd));
         console.log(regularBase.valueOf());

         const name: RegularName = {
            name: "",
            regularBase: matchNameEnding(regularBase, config)
         };
         name.name = this.letterFinalizerService.finalizeRegularLetters(name.regularBase.referenceRegular, config);
         name.name = this.dereferenceName(name.name, name.regularBase.references);
         name.name = capitalize(name.name);
         return name;
      }

      const regularBase = new RegularNameObject(matchNameEnding(config.regularNameBase, config));
      let name = this.letterFinalizerService.finalizeRegularLetters(regularBase.valueOf(), config);
      name = this.dereferenceName(name, regularBase.references);
      name = capitalize(name);
      return { name, regularBase };
   }

   private dereferenceName(name: string, references: number[]): string {
      let dereferencedName = "";
      for (let i = 0; i < name.length; i++) {
         if (references[i] !== undefined) {
            dereferencedName += dereferencedName[references[i]];
         } else {
            dereferencedName += name[i];
         }
      }
      return dereferencedName;
   }
}
