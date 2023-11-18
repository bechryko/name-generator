import { Generators } from "@ngen-generation/enums";
import { BoundedConfigProperty, GeneratorConfigFields, PropertyBounds } from "../model";

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
         case Generators.REGULAR:
            return {
               minLength: true,
               maxLength: true,
               excludedLetters: true,
               includedLetters: true,
               ignoreVoicedUnvoicedPairs: true,
               regularNameStart: true,
               regularNameEnd: true,
               regularNameBase: true
            };
         default:
            return {};
      }
   }

   public static getConfigPropertyBounds(property: BoundedConfigProperty): Partial<PropertyBounds> {
      switch(property) {
         case 'lengthInSyllables':
            return {
               min: 1,
               max: 20
            };
         case 'lengthInLetters':
            return {
               min: 2,
               max: 50
            };
         default:
            return {};
      }
   }
}
