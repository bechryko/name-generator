import { Injectable } from '@angular/core';
import { NgenArray } from '@ngen-core/models';
import { SyllabicName } from '@ngen-core/names';
import { NameFormatUtils, RandomUtils } from '@ngen-core/utils';
import { GenerationConfig } from '@ngen-generation/models';
import { GeneratorAlgorithmsModule } from '../generator-algorithms.module';
import { GeneratorService } from '../generator-service.model';
import { LetterFinalizerService } from '../letter-finalization/letter-finalizer.service';
import { matchNameEnding } from '../name-endings';

@Injectable({
   providedIn: GeneratorAlgorithmsModule
})
export class SyllabicGeneratorService implements GeneratorService {
   public readonly version = "1.0" as const;
   
   private readonly syllableLengthWeights = [.1, .35, .5, .05];

   constructor(
      private readonly letterFinalizerService: LetterFinalizerService
   ) { }

   public generateName(config: GenerationConfig): SyllabicName {
      const length = RandomUtils.between(config.minLength, config.maxLength);
      const name: SyllabicName = {
         name: "",
         regularBase: "",
         syllabic: [],
         regularSyllabic: [] as any as NgenArray<string>
      };

      let lastSyllable = "";
      for (let i = 0; i < length; i++) {
         const weights = [...this.syllableLengthWeights];
         if (lastSyllable.length <= 2) {
            weights[0] = weights[0] / (weights[0] + weights[1]);
         } else {
            weights[0] = 0;
         }
         const syllableSize = RandomUtils.randomIndexWeighted([1, 2, 3, 4], weights);
         this.appendRegularSyllable(name, syllableSize);
         lastSyllable = name.regularSyllabic.last();
      }

      name.regularBase = matchNameEnding(name.regularBase, config);

      try {
         name.name = this.letterFinalizerService.finalizeRegularLetters(name.regularBase, config);
      } catch (e) {
         console.error("error while finalizing name", name.regularBase, e); //TODO: handling
      }

      let index = 0;
      for (let i = 0; i < name.regularSyllabic.length; i++) {
         name.syllabic.push(name.name.substring(index, index + name.regularSyllabic[i].length));
         index += name.regularSyllabic[i].length;
      }

      name.name = NameFormatUtils.capitalizeName(name.name);
      name.syllabic[0] = NameFormatUtils.capitalizeName(name.syllabic[0]);
      return name;
   }

   private appendRegularSyllable(name: SyllabicName, syllableSize: number): void {
      let regular = "";
      if (syllableSize > 1) {
         regular += "-";
      }
      regular += "+";
      for (let j = 2; j < syllableSize; j++) {
         regular += "-";
      }
      name.regularBase += regular;
      name.regularSyllabic.push(regular);
   }
}
