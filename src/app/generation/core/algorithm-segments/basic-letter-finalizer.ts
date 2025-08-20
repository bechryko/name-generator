import { RegularCharacter, RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { errorMessages } from "../constants";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationConfig, GenerationData, GenerationErrors, RandomLetterConfig } from "../models";
import { LetterUtils, NameStartingDoubleConsonantUtils, VoicedUnvoicedPairsUtils } from "../utils";

export type BasicLetterFinalizerConfig = Pick<
   GenerationConfig,
   "excludedLetters" | "includedLetters" | "ignoreVoicedUnvoicedPairs" | "disableLetterWeights"
>;

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
      const generationErrors = data.errors.clone();

      for (let i = 0; i < characters.length; i++) {
         const char = characters[i];

         if (this.isCharacterUnfinalizable(char)) {
            continue;
         }

         const nextChar: RegularCharacter | undefined = characters[i + 1];
         if (
            i === 0 &&
            char.isConsonant &&
            nextChar?.isConsonant &&
            !this.isCharacterUnfinalizable(nextChar) &&
            NameStartingDoubleConsonantUtils.canStartWithDoubleConsonant(config)
         ) {
            this.finalizeNameStartingDoubleConsonant(i, characters, config);
            i++;
            continue;
         }

         this.finalizeCharacter(i, characters, config, generationErrors);
      }

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1,
         errors: generationErrors
      };
      return [regular.getValue(), newData];
   }

   public override getInputType(): AlgorithmDataType.REGULAR_STRING {
      return AlgorithmDataType.REGULAR_STRING;
   }

   public override getOutputType(): AlgorithmDataType.NAME {
      return AlgorithmDataType.NAME;
   }

   private isCharacterUnfinalizable(char: RegularCharacter): boolean {
      return char.isReference || LetterUtils.is("letter", char.toString());
   }

   private finalizeCharacter(
      index: number,
      characters: RegularCharacter[],
      config: BasicLetterFinalizerConfig,
      generationErrors: GenerationErrors
   ): void {
      const char = characters[index];

      if (char.isVowel) {
         char.assign(LetterUtils.random("vowel", this.getRandomLetterConfig(config, generationErrors)));
      } else if (char.isConsonant) {
         char.assign(
            LetterUtils.random("consonant", this.getRandomLetterConfig(config, generationErrors, characters[index - 1]))
         );
      } else {
         console.warn(`Invalid character during character finalization: '${char}!'`);
         char.assign(LetterUtils.random("letter", this.getRandomLetterConfig(config, generationErrors)));
      }
   }

   private finalizeNameStartingDoubleConsonant(
      index: number,
      characters: RegularCharacter[],
      config: BasicLetterFinalizerConfig
   ): void {
      const doubleConsonants = NameStartingDoubleConsonantUtils.getNameStartingDoubleConsonants(config);
      const chosenDoubleConsonant = RandomUtils.randomIndex(doubleConsonants);

      characters[index].assign(chosenDoubleConsonant[0]);
      characters[index + 1].assign(chosenDoubleConsonant[1]);
   }

   private getRandomLetterConfig(
      config: BasicLetterFinalizerConfig,
      generationErrors: GenerationErrors,
      latestLetter?: RegularCharacter
   ): RandomLetterConfig {
      const genConfig: BasicLetterFinalizerConfig = { ...config };
      const randConfig: RandomLetterConfig = {
         disableLetterWeights: config.disableLetterWeights
      };

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
            generationErrors.add(errorMessages.generation.letterSetDepleted);
         }
      }

      if (!genConfig.includedLetters.isEmpty()) {
         if (
            LetterUtils.numberOf("vowel", genConfig.includedLetters.toString()) > 0 &&
            LetterUtils.numberOf("consonant", genConfig.includedLetters.toString()) > 0
         ) {
            randConfig.included = genConfig.includedLetters.toString();
         } else {
            generationErrors.add(errorMessages.generation.letterSetDepleted);
         }
      }

      return randConfig;
   }
}
