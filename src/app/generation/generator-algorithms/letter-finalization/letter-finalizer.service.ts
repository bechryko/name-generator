import { Injectable } from '@angular/core';
import { ErrorMessageId, ErrorService } from '@ngen-core/error-handling';
import { replaceLetter } from '@ngen-core/functions';
import { RandomUtils } from '@ngen-core/utils';
import { GenerationConfig } from '@ngen-generation/models';
import { RandomLetterConfig } from './models';
import { LetterUtils, RegularUtils, VoicedUnvoicedPairsUtils } from './utils';

@Injectable()
export class LetterFinalizerService {
   private generationError: ErrorMessageId<'generation'> | null = null;

   constructor(
      private readonly errorService: ErrorService
   ) { }

   public finalizeRegularLetters(regular: string, config: GenerationConfig): string {
      regular = this.finalizeWildcardRegulars(regular, config);
      const defaultRandomLetterConfig = this.getRandomLetterConfig(config);

      let name = "";
      for (let i = 0; i < regular.length; i++) {
         if (regular[i] === RegularUtils.symbols.vowel) {
            name += LetterUtils.random('vowel', defaultRandomLetterConfig);
         } else if (regular[i] === RegularUtils.symbols.consonant) {
            name += LetterUtils.random('consonant', this.getRandomLetterConfig(config, name[i - 1]));
         } else {
            name += regular[i];
         }
      }

      if (this.generationError) { 
         this.errorService.popupError('generation', this.generationError);
         this.generationError = null;
      }

      return name;
   }

   private finalizeWildcardRegulars(regular: string, config: GenerationConfig): string {
      for (let i = 0; i < regular.length; i++) {
         if (regular[i] !== RegularUtils.symbols.wildcard) {
            continue;
         }
         let vowelsInRange = 0, consonantsInRange = 0;
         for (let j = -2; j <= 2; j++) {
            if (regular[i + j] === RegularUtils.symbols.vowel) {
               vowelsInRange++;
            } else if (regular[i + j] === RegularUtils.symbols.consonant) {
               consonantsInRange++;
            }
         }
         if (vowelsInRange === consonantsInRange) {
            if (vowelsInRange === 2) {
               if (regular[i + 1] === regular[i - 1]) {
                  regular = replaceLetter(regular, i, this.vowelIf(regular[i - 1] === RegularUtils.symbols.consonant));
               } else {
                  regular = replaceLetter(regular, i, this.vowelIf(RandomUtils.byChance(LetterUtils.getVowelChance(config.excludedLetters, config.includedLetters))));
               }
            } else if (vowelsInRange === 1) {
               regular = replaceLetter(regular, i, this.vowelIf(regular[i - 1] === RegularUtils.symbols.consonant));
            } else {
               regular = replaceLetter(regular, i, this.vowelIf(RandomUtils.byChance(LetterUtils.getVowelChance(config.excludedLetters, config.includedLetters))));
            }
         } else {
            if (i === regular.length - 2 && regular[i + 1] === RegularUtils.symbols.consonant) {
               regular = replaceLetter(regular, i, RegularUtils.symbols.vowel);
            } else {
               regular = replaceLetter(regular, i, this.vowelIf(consonantsInRange > vowelsInRange));
            }
         }
      }
      return regular;
   }

   private getRandomLetterConfig(config: GenerationConfig, latestLetter?: string): RandomLetterConfig {
      const genConfig: GenerationConfig = { ...config };
      const randConfig: RandomLetterConfig = {};

      if (latestLetter) {
         if (!genConfig.ignoreVoicedUnvoicedPairs) {
            genConfig.excludedLetters += VoicedUnvoicedPairsUtils.pairOf(latestLetter) ?? "";
         }
      }

      if (genConfig.excludedLetters) {
         if (LetterUtils.numberOf('vowel', genConfig.excludedLetters) < LetterUtils.numberOf('vowel')
            && LetterUtils.numberOf('consonant', genConfig.excludedLetters) < LetterUtils.numberOf('consonant')
         ) {
            randConfig.excluded = genConfig.excludedLetters;
         } else {
            this.generationError = 'LETTER_SET_DEPLETED';
         }
      }

      if (genConfig.includedLetters) {
         if (LetterUtils.numberOf('vowel', genConfig.includedLetters) > 0
            && LetterUtils.numberOf('consonant', genConfig.includedLetters) > 0
         ) {
            randConfig.included = genConfig.includedLetters;
         } else {
            this.generationError = 'LETTER_SET_DEPLETED';
         }
      }
      
      return randConfig;
   }

   private vowelIf(condition: boolean): string {
      return condition ? RegularUtils.symbols.vowel : RegularUtils.symbols.consonant;
   }
}
