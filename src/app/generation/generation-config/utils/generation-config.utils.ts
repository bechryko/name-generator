import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { BoundedConfigProperty, GeneratorConfigFields, PropertyBounds } from "../model";

export class GenerationConfigUtils {
   public static getConfig(generator: GeneratorAlgorithmName | undefined): GeneratorConfigFields {
      switch (generator) {
         case GeneratorAlgorithmName.JAPANESE:
            return {
               minLength: true,
               maxLength: true
            };
         case GeneratorAlgorithmName.SYLLABIC:
            return {
               minLength: true,
               maxLength: true,
               excludedLetters: true,
               includedLetters: true,
               ignoreVoicedUnvoicedPairs: true
            };
         case GeneratorAlgorithmName.REGULAR:
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
      switch (property) {
         case "lengthInSyllables":
            return {
               min: 1,
               max: 10
            };
         case "lengthInLetters":
            return {
               min: 2,
               max: 25
            };
         default:
            return {};
      }
   }
}
