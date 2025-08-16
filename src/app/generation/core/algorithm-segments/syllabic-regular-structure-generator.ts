import { LetterSet, RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationData } from "../models";
import { NameStartingDoubleConsonantUtils } from "../utils";

export interface SyllabicRegularStructureGeneratorConfig {
   minLength: number;
   maxLength: number;
   includedLetters: LetterSet;
   excludedLetters: LetterSet;
}

export class SyllabicRegularStructureGenerator extends AlgorithmSegment<
   AlgorithmDataType.VOID,
   AlgorithmDataType.REGULAR_STRING,
   SyllabicRegularStructureGeneratorConfig
> {
   private static readonly SYLLABLE_LENGTH_WEIGHTS = [0.1, 0.35, 0.5, 0.05];
   private static readonly DOUBLE_CONSONANT_START_CHANCE = 0.05;

   public override transform(
      _: undefined,
      config: SyllabicRegularStructureGeneratorConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const length = RandomUtils.between(config.minLength, config.maxLength);
      const regularBase = new RegularString();

      let lastSyllable: RegularString | null = null;
      for (let i = 0; i < length; i++) {
         const weights = [...SyllabicRegularStructureGenerator.SYLLABLE_LENGTH_WEIGHTS];
         if (!lastSyllable || lastSyllable.length <= 2) {
            weights[0] = weights[0] / (weights[0] + weights[1]);
         } else {
            weights[0] = 0;
         }

         const syllableSize = RandomUtils.randomIndexWeighted([1, 2, 3, 4], weights);
         lastSyllable = this.createRegularSyllable(syllableSize, config);
         regularBase.append(lastSyllable);
      }

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
