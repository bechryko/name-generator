import { RandomLetterConfig } from "@ngen-generation/generator-algorithms/letter-finalization/models";
import { LetterUtils, VoicedUnvoicedPairsUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { LetterSet, RegularCharacter, RegularString } from "@ngen-shared/models";
import { AlgorithmDataType, AlgorithmSegment, GenerationData } from "../models";

export interface BasicLetterFinalizerConfig {
   excludedLetters: LetterSet;
   includedLetters: LetterSet;
   ignoreVoicedUnvoicedPairs: boolean;
}

export class BasicLetterFinalizer extends AlgorithmSegment<
   AlgorithmDataType.REGULAR_STRING,
   AlgorithmDataType.NAME,
   BasicLetterFinalizerConfig
> {
   public override transform(
      input: RegularString,
      config: BasicLetterFinalizerConfig,
      data: GenerationData
   ): [string, GenerationData] {
      const regular = input.clone();
      const characters = regular.getCharacters();
      for (let i = 0; i < characters.length; i++) {
         const char = characters[i];

         if (char.isReference || LetterUtils.is("letter", char.toString())) {
            continue;
         }
         this.finalizeCharacter(i, characters, config);
      }

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1
      };
      return [regular.getValue(), newData];
   }

   public override getInputType(): AlgorithmDataType.REGULAR_STRING {
      return AlgorithmDataType.REGULAR_STRING;
   }

   public override getOutputType(): AlgorithmDataType.NAME {
      return AlgorithmDataType.NAME;
   }

   private finalizeCharacter(index: number, characters: RegularCharacter[], config: BasicLetterFinalizerConfig): void {
      const char = characters[index];

      if (char.isVowel) {
         char.assign(LetterUtils.random("vowel", this.getRandomLetterConfig(config)));
      } else if (char.isConsonant) {
         char.assign(LetterUtils.random("consonant", this.getRandomLetterConfig(config, characters[index - 1])));
      } else {
         throw new Error(`Invalid character during character finalization: '${char}!'`);
      }
   }

   private getRandomLetterConfig(
      config: BasicLetterFinalizerConfig,
      latestLetter?: RegularCharacter
   ): RandomLetterConfig {
      const genConfig: BasicLetterFinalizerConfig = { ...config };
      const randConfig: RandomLetterConfig = {};

      if (latestLetter) {
         const pair = VoicedUnvoicedPairsUtils.pairOf(latestLetter.toString());
         if (!genConfig.ignoreVoicedUnvoicedPairs && pair) {
            genConfig.excludedLetters.add(pair);
         }
      }

      if (!genConfig.excludedLetters.isEmpty()) {
         if (
            LetterUtils.numberOf("vowel", genConfig.excludedLetters.toString()) < LetterUtils.numberOf("vowel") &&
            LetterUtils.numberOf("consonant", genConfig.excludedLetters.toString()) < LetterUtils.numberOf("consonant")
         ) {
            randConfig.excluded = genConfig.excludedLetters.toString();
         } else {
            // this.generationError = "LETTER_SET_DEPLETED"; TODO
         }
      }

      if (!genConfig.includedLetters.isEmpty()) {
         if (
            LetterUtils.numberOf("vowel", genConfig.includedLetters.toString()) > 0 &&
            LetterUtils.numberOf("consonant", genConfig.includedLetters.toString()) > 0
         ) {
            randConfig.included = genConfig.includedLetters.toString();
         } else {
            // this.generationError = "LETTER_SET_DEPLETED"; TODO
         }
      }

      return randConfig;
   }
}
