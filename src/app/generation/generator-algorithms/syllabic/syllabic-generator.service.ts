import { Injectable, inject } from "@angular/core";
import { GenerationConfig } from "@ngen-generation/models";
import { capitalize, last } from "@ngen-shared/functions";
import { RegularString } from "@ngen-shared/models";
import { SyllabicName } from "@ngen-shared/names";
import { RandomUtils } from "@ngen-shared/utils";
import { GeneratorService } from "../generator-service.model";
import { LetterFinalizerService } from "../letter-finalization/letter-finalizer.service";
import { matchNameEnding } from "../name-endings";

@Injectable()
export class SyllabicGeneratorService implements GeneratorService {
   private readonly letterFinalizerService = inject(LetterFinalizerService);

   private readonly syllableLengthWeights = [0.1, 0.35, 0.5, 0.05];

   public generateName(config: GenerationConfig): SyllabicName {
      const length = RandomUtils.between(config.minLength, config.maxLength);
      const name: SyllabicName = {
         name: "",
         regularBase: new RegularString(),
         syllabic: [],
         regularSyllabic: []
      };

      let lastSyllable: RegularString | null = null;
      for (let i = 0; i < length; i++) {
         const weights = [...this.syllableLengthWeights];
         if (!lastSyllable || lastSyllable.length <= 2) {
            weights[0] = weights[0] / (weights[0] + weights[1]);
         } else {
            weights[0] = 0;
         }
         const syllableSize = RandomUtils.randomIndexWeighted([1, 2, 3, 4], weights);
         this.appendRegularSyllable(name, syllableSize);
         lastSyllable = last(name.regularSyllabic);
      }

      name.regularBase = matchNameEnding(name.regularBase, config);

      try {
         const finalizedRegular = name.regularBase.clone();
         this.letterFinalizerService.finalizeRegularString(finalizedRegular, config);
         name.name = finalizedRegular.getValue();
      } catch (e) {
         console.error("error while finalizing name", name.regularBase, e); //TODO: handling
      }

      let index = 0;
      for (const syllable of name.regularSyllabic) {
         name.syllabic.push(name.name.substring(index, (index = index + syllable.length)));
      }

      name.name = capitalize(name.name);
      name.syllabic[0] = capitalize(name.syllabic[0]);
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
      name.regularBase.append(regular);
      name.regularSyllabic.push(new RegularString(regular));
   }
}
