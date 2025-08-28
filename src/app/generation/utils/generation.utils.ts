import {
   japaneseGeneratorAlgorithm,
   phoneticGeneratorAlgorithm,
   regularGeneratorAlgorithm,
   syllabicGeneratorAlgorithm
} from "@ngen-generation/core/algorithms";
import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { GenerationConfig, NameGeneratorAlgorithm } from "@ngen-generation/core/models";
import { LetterSet, RegularString } from "@ngen-shared/models";

export class GenerationUtils {
   private static readonly GENERATOR_ALGORITHMS = [
      japaneseGeneratorAlgorithm,
      regularGeneratorAlgorithm,
      syllabicGeneratorAlgorithm,
      phoneticGeneratorAlgorithm
   ];

   public static findAlgorithm(name: GeneratorAlgorithmName): NameGeneratorAlgorithm {
      const algorithm = this.GENERATOR_ALGORITHMS.find(algorithm => algorithm.name === name);
      if (!algorithm) {
         throw new Error("Cannot find generator algorithm: " + name);
      }
      return algorithm;
   }

   public static configToJSON(config: GenerationConfig): string {
      const rawConfig = Object.entries(config).reduce<Object>((obj, [key, value]) => {
         if (typeof value === "object") {
            return {
               ...obj,
               [key]: value.toString()
            };
         }

         return {
            ...obj,
            [key]: value
         };
      }, {});

      return JSON.stringify(rawConfig);
   }

   public static JSONToConfig(json: string): GenerationConfig {
      const rawConfig = JSON.parse(json);

      return {
         ...rawConfig,
         includedLetters: new LetterSet(rawConfig.includedLetters),
         excludedLetters: new LetterSet(rawConfig.excludedLetters),
         regularNameStart: new RegularString(rawConfig.regularNameStart),
         regularNameEnd: new RegularString(rawConfig.regularNameEnd),
         regularNameBase: new RegularString(rawConfig.regularNameBase)
      } as GenerationConfig;
   }
}
