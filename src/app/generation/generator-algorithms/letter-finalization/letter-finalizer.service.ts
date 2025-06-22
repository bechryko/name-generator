import { Injectable, inject } from "@angular/core";
import { ErrorMessageId, ErrorService } from "@ngen-core/error-handling";
import { RegularCharacter, RegularString } from "@ngen-core/models";
import { RandomUtils } from "@ngen-core/utils";
import { GenerationConfig } from "@ngen-generation/models";
import { RandomLetterConfig } from "./models";
import { LetterUtils, RegularUtils, VoicedUnvoicedPairsUtils } from "./utils";

@Injectable()
export class LetterFinalizerService {
   private readonly errorService = inject(ErrorService);

   private generationError: ErrorMessageId<"generation"> | null = null;

   public finalizeRegularString(string: RegularString, config: GenerationConfig): void {
      const characters = string.getCharacters();
      for (let iteration = 0; iteration < 2; iteration++) {
         for (let i = 0; i < characters.length; i++) {
            const char = characters[i];

            if (char.isReference || LetterUtils.is("letter", char.toString())) {
               continue;
            }
            if (char.isWildcard) {
               if (iteration === 0) {
                  this.decideWildcardType(i, characters, config);
               }
            } else {
               if (iteration === 1) {
                  this.finalizeCharacter(i, characters, config);
               }
            }
         }
      }
   }

   private decideWildcardType(index: number, characters: Readonly<RegularCharacter[]>, config: GenerationConfig): void {
      const char = characters[index];

      let vowelsInRange = 0,
         consonantsInRange = 0;
      for (let j = -2; j <= 2; j++) {
         if (characters[index + j]?.isVowel) {
            vowelsInRange++;
         } else if (characters[index + j]?.isConsonant) {
            consonantsInRange++;
         }
      }

      if (vowelsInRange === consonantsInRange) {
         if (vowelsInRange === 2) {
            if (characters[index + 1] === characters[index - 1]) {
               char.assign(this.vowelIf(characters[index - 1].isConsonant));
            } else {
               char.assign(
                  this.vowelIf(
                     RandomUtils.byChance(LetterUtils.getVowelChance(config.excludedLetters, config.includedLetters))
                  )
               );
            }
         } else if (vowelsInRange === 1) {
            char.assign(this.vowelIf(characters[index - 1]?.isConsonant));
         } else {
            char.assign(
               this.vowelIf(
                  RandomUtils.byChance(LetterUtils.getVowelChance(config.excludedLetters, config.includedLetters))
               )
            );
         }
      } else {
         if (index === characters.length - 2 && characters[index + 1].isConsonant) {
            char.assign(RegularUtils.symbols.vowel);
         } else {
            char.assign(this.vowelIf(consonantsInRange > vowelsInRange));
         }
      }
   }

   private finalizeCharacter(index: number, characters: RegularCharacter[], config: GenerationConfig): void {
      const char = characters[index];

      if (char.isVowel) {
         char.assign(LetterUtils.random("vowel", this.getRandomLetterConfig(config)));
      } else if (char.isConsonant) {
         char.assign(LetterUtils.random("consonant", this.getRandomLetterConfig(config, characters[index - 1])));
      } else {
         throw new Error(`Invalid character during character finalization: '${char}!'`);
      }

      if (this.generationError) {
         this.errorService.popupError("generation", this.generationError);
         this.generationError = null;
      }
   }

   private getRandomLetterConfig(config: GenerationConfig, latestLetter?: RegularCharacter): RandomLetterConfig {
      const genConfig: GenerationConfig = { ...config };
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
            this.generationError = "LETTER_SET_DEPLETED";
         }
      }

      if (!genConfig.includedLetters.isEmpty()) {
         if (
            LetterUtils.numberOf("vowel", genConfig.includedLetters.toString()) > 0 &&
            LetterUtils.numberOf("consonant", genConfig.includedLetters.toString()) > 0
         ) {
            randConfig.included = genConfig.includedLetters.toString();
         } else {
            this.generationError = "LETTER_SET_DEPLETED";
         }
      }

      return randConfig;
   }

   private vowelIf(condition: boolean): string {
      return condition ? RegularUtils.symbols.vowel : RegularUtils.symbols.consonant;
   }
}
