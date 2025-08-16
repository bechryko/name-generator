import { LetterSet, RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationData } from "../models";
import { AvailableLetterUtils, RegularUtils } from "../utils";

export interface NameEndingApplierConfig {
   excludedLetters: LetterSet;
   includedLetters: LetterSet;
}

export class NameEndingApplier extends AlgorithmSegment<
   AlgorithmDataType.REGULAR_STRING,
   AlgorithmDataType.REGULAR_STRING,
   NameEndingApplierConfig
> {
   private static readonly DOUBLE_CONSONANT_ENDINGS = ["lf", "lv", "lt", "ld", "mn", "rk", "ck"];
   private static readonly NAME_ENDINGS = [
      "in+",
      "ia-+",
      "ni+",
      "+s",
      "i+s",
      "+n",
      "+m",
      "+nk+",
      "+-+",
      "-ia",
      ...this.DOUBLE_CONSONANT_ENDINGS.map(e => RegularUtils.symbols.vowel + e)
   ];

   public override transform(
      input: RegularString,
      config: NameEndingApplierConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const matchingEndings = AvailableLetterUtils.filterByAvailableLetters(
         NameEndingApplier.NAME_ENDINGS,
         config
      ).filter(ending => input.ending(ending.length, true).doesMatch(ending));

      const regular = input.clone();
      if (matchingEndings.length) {
         const chosenEnding = RandomUtils.randomIndex(matchingEndings);
         regular.match(chosenEnding, regular.length - chosenEnding.length);
      }

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1,
         regularTemplate: regular.toString()
      };
      return [regular, newData];
   }

   public override getInputType(): AlgorithmDataType.REGULAR_STRING {
      return AlgorithmDataType.REGULAR_STRING;
   }

   public override getOutputType(): AlgorithmDataType.REGULAR_STRING {
      return AlgorithmDataType.REGULAR_STRING;
   }
}
