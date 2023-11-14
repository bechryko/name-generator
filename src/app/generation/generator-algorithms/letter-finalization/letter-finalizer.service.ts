import { Injectable } from '@angular/core';
import { ErrorMessageId, ErrorService } from '@ngen-core/error-handling';
import { RandomUtils } from '@ngen-core/utils';
import { GenerationConfig } from '@ngen-generation/models';
import { nameEndings } from '../name-endings';
import { RandomLetterConfig } from './models';
import { LetterUtils, RegularUtils, VoicedUnvoicedPairsUtils } from './utils';

@Injectable()
export class LetterFinalizerService {
  private generationError: ErrorMessageId<'generation'> | null = null;

  constructor(
    private readonly errorService: ErrorService
  ) { }

  public finalizeRegularLetters(regular: string, config: GenerationConfig, matchNameEnding = true): string {
    let name = "";

    if(matchNameEnding) {
      const matchingEndings: string[] = [];
      for(const ending of nameEndings) {
        if(RegularUtils.matchRegular(ending, regular.substring(regular.length - ending.length))) {
          matchingEndings.push(ending);
        }
      }
      if(matchingEndings.length) {
        const chosenEnding = RandomUtils.randomIndex(matchingEndings);
        regular = regular.substring(0, regular.length - chosenEnding.length) + chosenEnding;
      }
    }

    for(let i = 0; i < regular.length; i++) {
      if(regular[i] === '+') {
        name += LetterUtils.random('vowel', this.getRandomLetterConfig(config));
      } else if(regular[i] === '-') {
        name += LetterUtils.random('consonant', this.getRandomLetterConfig(config, name[i-1])); //TODO: handle consonant doubling
      } else if(RegularUtils.isReference(regular[i])) {
        name += RegularUtils.dereference(name, regular[i] as any);
      } else {
        name += regular[i];
      }

      if(this.generationError) {
        this.errorService.popupError('generation', this.generationError);
        this.generationError = null;
      }
    }
    
    return name;
  }

  private getRandomLetterConfig(config: GenerationConfig, latestLetter?: string): RandomLetterConfig {
    const genConfig = { ...config } as GenerationConfig;
    const randConfig = {} as RandomLetterConfig;

    if(latestLetter) {
      if(!genConfig.ignoreVoicedUnvoicedPairs) {
        genConfig.excludedLetters += VoicedUnvoicedPairsUtils.pairOf(latestLetter);
      }
    }

    if(genConfig.excludedLetters) {
      if(LetterUtils.numberOf('vowel', genConfig.excludedLetters) < LetterUtils.numberOf('vowel')
        && LetterUtils.numberOf('consonant', genConfig.excludedLetters) < LetterUtils.numberOf('consonant')
      ) {
        randConfig.excluded = genConfig.excludedLetters;
      } else {
        this.generationError = 'LETTER_SET_DEPLETED';
      }
    }

    if(genConfig.includedLetters && (!genConfig.excludedLetters || !genConfig.excludedLetters.length)) {
      if(LetterUtils.numberOf('vowel', genConfig.includedLetters) > 0
        && LetterUtils.numberOf('consonant', genConfig.includedLetters) > 0
      ) {
        randConfig.included = genConfig.includedLetters;
      } else {
        this.generationError = 'LETTER_SET_DEPLETED';
      }
    }

    return randConfig;
  }
}
