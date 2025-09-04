import { RegularString } from "@ngen-shared/models";
import { RandomUtils, WeightCalculationUtils } from "@ngen-shared/utils";
import { AlgorithmDataType } from "../../enums";
import { AlgorithmSegment, GenerationConfig, GenerationData } from "../../models";
import { NameStartingDoubleConsonantUtils } from "../../utils";

export type SyllabicRegularStructureGeneratorConfig = Pick<
   GenerationConfig,
   "minLength" | "maxLength" | "includedLetters" | "excludedLetters" | "syllableAlleviation"
>;

export class SyllabicRegularStructureGenerator extends AlgorithmSegment<
   AlgorithmDataType.VOID,
   AlgorithmDataType.REGULAR_STRING,
   SyllabicRegularStructureGeneratorConfig
> {
   private static readonly SYLLABLE_LENGTH_WEIGHTS = [0.2, 0.5, 0.25, 0.05];
   private static readonly DOUBLE_CONSONANT_START_CHANCE = 0.05;
   private static readonly TWO_SYLLABLE_MAX_CONSONANTS = 4;
   private static readonly THREE_SYLLABLE_MAX_CONSONANTS = 6;
   private static readonly THREE_SYLLABLE_MIN_CONSONANTS = 2;

   public override transform(
      _: undefined,
      config: SyllabicRegularStructureGeneratorConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const length = RandomUtils.between(config.minLength, config.maxLength);
      const syllables: RegularString[] = [];

      for (let i = 0; i < length; i++) {
         const syllableSize = this.getSyllableSize(syllables, config);
         const newSyllable = this.createRegularSyllable(syllableSize, config);
         syllables.push(newSyllable);
      }

      const regularBase = syllables.reduce((base, syllable) => {
         base.append(syllable);
         return base;
      }, new RegularString());

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1,
         regularTemplate: regularBase.toString()
      };
      return [regularBase, newData];
   }

   public override getInputType(): AlgorithmDataType.VOID {
      return AlgorithmDataType.VOID;
   }

   public override getOutputType(): AlgorithmDataType.REGULAR_STRING {
      return AlgorithmDataType.REGULAR_STRING;
   }

   private getSyllableSize(syllables: RegularString[], config: SyllabicRegularStructureGeneratorConfig): number {
      const lastSyllable = syllables[syllables.length - 1];
      const beforeLastSyllable = syllables[syllables.length - 2];

      const weights = [...SyllabicRegularStructureGenerator.SYLLABLE_LENGTH_WEIGHTS];
      if (!lastSyllable || lastSyllable.length <= 2) {
         weights[0] = weights[0] / (weights[0] + weights[1]);
      } else {
         weights[0] = 0;
      }

      const weightedLengths = WeightCalculationUtils.assignWeights([1, 2, 3, 4], (_, index) => weights[index]);
      let syllableSize = RandomUtils.randomIndexWeighted(weightedLengths);

      if (config.syllableAlleviation) {
         const consonantsInLastSyllable = lastSyllable ? lastSyllable.length - 1 : 0;
         const consonantsInBeforeLastSyllable = beforeLastSyllable ? beforeLastSyllable.length - 1 : 0;

         while (
            (lastSyllable &&
               consonantsInLastSyllable + syllableSize - 1 >
                  SyllabicRegularStructureGenerator.TWO_SYLLABLE_MAX_CONSONANTS) ||
            (beforeLastSyllable &&
               consonantsInBeforeLastSyllable + consonantsInLastSyllable + syllableSize - 1 >
                  SyllabicRegularStructureGenerator.THREE_SYLLABLE_MAX_CONSONANTS)
         ) {
            syllableSize--;
         }
         while (
            beforeLastSyllable &&
            consonantsInBeforeLastSyllable + consonantsInLastSyllable + syllableSize - 1 <
               SyllabicRegularStructureGenerator.THREE_SYLLABLE_MIN_CONSONANTS
         ) {
            syllableSize++;
         }
      }

      return syllableSize;
   }

   private createRegularSyllable(size: number, config: SyllabicRegularStructureGeneratorConfig): RegularString {
      const regular = new RegularString();
      let currentLetters = 0;

      if (size > 1) {
         regular.append("-");
         currentLetters++;

         if (
            NameStartingDoubleConsonantUtils.canStartWithDoubleConsonant(config) &&
            RandomUtils.byChance(SyllabicRegularStructureGenerator.DOUBLE_CONSONANT_START_CHANCE)
         ) {
            regular.append("-");
            currentLetters++;
         }
      }

      regular.append("+");
      currentLetters++;

      while (currentLetters < size) {
         regular.append("-");
         currentLetters++;
      }

      return regular;
   }
}
