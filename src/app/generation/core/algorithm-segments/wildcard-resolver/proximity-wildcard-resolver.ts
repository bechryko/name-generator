import { RegularCharacter, RegularString } from "@ngen-shared/models";
import { LetterUtils, RandomUtils, RegularUtils } from "@ngen-shared/utils";
import { AlgorithmDataType } from "../../enums";
import { AlgorithmSegment, GenerationConfig, GenerationData } from "../../models";
import { NameStartingDoubleConsonantUtils } from "../../utils";

export type ProximityWildcardResolverConfig = Pick<
   GenerationConfig,
   "excludedLetters" | "includedLetters" | "disableLetterWeights"
>;

export class ProximityWildcardResolver extends AlgorithmSegment<
   AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS,
   AlgorithmDataType.REGULAR_STRING,
   ProximityWildcardResolverConfig
> {
   private static readonly DOUBLE_CONSONANT_START_CHANCE = 0.1;

   public override transform(
      input: RegularString,
      config: ProximityWildcardResolverConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const regular = input.clone();
      const characters = regular.getCharacters();

      characters.forEach((char, index) => {
         if (char.isWildcard) {
            this.decideWildcardType(index, characters, config);
         }
      });

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

      const previousChar = characters[index - 1];
      const nextChar = characters[index + 1];

      if (vowelsInRange === consonantsInRange) {
         if (vowelsInRange === 2) {
            if (nextChar.equals(previousChar) && previousChar.isConsonant) {
               char.assign(RegularUtils.symbols.vowel);
            } else {
               char.assign(this.getRandomRegularByConfig(config));
            }
         } else if (vowelsInRange === 1 && previousChar) {
            if (consonantsInRange >= 2) {
               char.assign(this.vowelIf(previousChar.isConsonant));
            } else {
               char.assign(this.getRandomRegularByConfig(config));
            }
         } else {
            char.assign(this.getRandomRegularByConfig(config));
         }
      } else {
         if (index === characters.length - 2 && nextChar.isConsonant) {
            char.assign(RegularUtils.symbols.vowel);
         } else if (
            index === 1 &&
            previousChar.isConsonant &&
            NameStartingDoubleConsonantUtils.canStartWithDoubleConsonant(config) &&
            RandomUtils.byChance(ProximityWildcardResolver.DOUBLE_CONSONANT_START_CHANCE)
         ) {
            char.assign(RegularUtils.symbols.consonant);
         } else {
            char.assign(this.vowelIf(consonantsInRange > vowelsInRange));
         }
      }
   }

   private getRandomRegularByConfig(config: ProximityWildcardResolverConfig): string {
      return this.vowelIf(RandomUtils.byChance(LetterUtils.getVowelChance(config)));
   }

   private vowelIf(condition: boolean): string {
      return condition ? RegularUtils.symbols.vowel : RegularUtils.symbols.consonant;
   }
}
