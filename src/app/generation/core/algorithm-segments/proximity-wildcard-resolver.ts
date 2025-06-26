import { LetterUtils, RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { LetterSet, RegularCharacter, RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { AlgorithmDataType, AlgorithmSegment, GenerationData } from "../models";

export interface ProximityWildcardResolverConfig {
   excludedLetters: LetterSet;
   includedLetters: LetterSet;
}

export class ProximityWildcardResolver extends AlgorithmSegment<
   AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS,
   AlgorithmDataType.REGULAR_STRING,
   ProximityWildcardResolverConfig
> {
   public override transform(
      input: RegularString,
      config: ProximityWildcardResolverConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const regular = input.clone();
      const characters = regular.getCharacters();

      characters
         .filter(char => char.isWildcard)
         .forEach((_, index) => this.decideWildcardType(index, characters, config));

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1,
         regularTemplate: regular.toString()
      };
      return [regular, newData];
   }

   public override getInputType(): AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS {
      return AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS;
   }

   public override getOutputType(): AlgorithmDataType.REGULAR_STRING {
      return AlgorithmDataType.REGULAR_STRING;
   }

   private decideWildcardType(
      index: number,
      characters: Readonly<RegularCharacter[]>,
      config: ProximityWildcardResolverConfig
   ): void {
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

   private vowelIf(condition: boolean): string {
      return condition ? RegularUtils.symbols.vowel : RegularUtils.symbols.consonant;
   }
}
