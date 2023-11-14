import { Generators } from "@ngen-generation/enums";
import { GeneratorConfigFields } from "../model";

interface PropertyBounds {
   min: number;
   max: number;
}

export class GenerationConfigUtils {
   public static getConfig(generator: Generators | undefined): GeneratorConfigFields {
      switch(generator) {
         case Generators.JAPANESE:
            return {
               minLength: true,
               maxLength: true
            };
         case Generators.SYLLABIC:
            return {
               minLength: true,
               maxLength: true,
               excludedLetters: true,
               includedLetters: true,
               ignoreVoicedUnvoicedPairs: true
            };
         default:
            return {};
      }
   }

   public static getConfigPropertyBounds(property: 'length'): Partial<PropertyBounds> {
      switch(property) {
         case 'length':
            return {
               min: 1,
               max: 20
            };
         default:
            return {};
      }
   }
}
