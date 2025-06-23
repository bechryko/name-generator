import { Injectable, inject } from "@angular/core";
import { capitalize } from "@ngen-core/functions";
import { RegularString } from "@ngen-core/models";
import { RegularName } from "@ngen-core/names";
import { RandomUtils } from "@ngen-core/utils";
import { GenerationConfig } from "@ngen-generation/models";
import { GeneratorService } from "../generator-service.model";
import { LetterFinalizerService } from "../letter-finalization/letter-finalizer.service";
import { RegularUtils } from "../letter-finalization/utils";
import { matchNameEnding } from "../name-endings";

@Injectable()
export class RegularGeneratorService implements GeneratorService {
   private readonly letterFinalizerService = inject(LetterFinalizerService);

   public generateName(config: GenerationConfig): RegularName {
      const regularBase = matchNameEnding(this.getRegularBase(config), config);
      const regular = regularBase.clone();
      try {
         this.letterFinalizerService.finalizeRegularString(regular, config);
      } catch (e) {
         console.error("error while finalizing name", regular, e); //TODO: handling
      }
      const name = capitalize(regular.getValue());
      return { name, regularBase };
   }

   private getRegularBase(config: GenerationConfig): RegularString {
      if (config.regularNameBase.length) {
         return config.regularNameBase.clone();
      }

      const length = RandomUtils.between(config.minLength, config.maxLength);
      const regularBase = config.regularNameStart.clone();
      for (let i = config.regularNameStart.length; i < length - config.regularNameEnd.length; i++) {
         regularBase.append(RegularUtils.symbols.wildcard);
      }
      regularBase.append(config.regularNameEnd);
      return regularBase;
   }
}
