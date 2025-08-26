import { RegularString, Weighted } from "@ngen-shared/models";
import { RandomUtils, WeightCalculationUtils } from "@ngen-shared/utils";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationConfig, GenerationData } from "../models";
import { AvailableLetterUtils } from "../utils";

export type NameEndingApplierConfig = Pick<GenerationConfig, "excludedLetters" | "includedLetters">;

export class NameEndingApplier extends AlgorithmSegment<
   AlgorithmDataType.REGULAR_STRING,
   AlgorithmDataType.REGULAR_STRING,
   NameEndingApplierConfig
> {
   private static readonly NAME_ENDINGS = [
      "in+",
      "ia-+",
      "ni+",
      "+(mns)",
      "i+s",
      "+nk+",
      "+-+",
      "-ia",
      "+l(dftv)",
      "+mn",
      "+(cr)k"
   ];
   private static readonly ENDING_WEIGHT_LOOKUP = WeightCalculationUtils.getWeightLookupForRegularTemplates(
      this.NAME_ENDINGS
   );

   public override transform(
      input: RegularString,
      config: NameEndingApplierConfig,
      data: GenerationData
   ): [RegularString, GenerationData] {
      const availableEndings = AvailableLetterUtils.filterByAvailableLetters(NameEndingApplier.NAME_ENDINGS, config);
      const weightedAvailableEndings = WeightCalculationUtils.addWeightByWeightLookup(
         availableEndings,
         NameEndingApplier.ENDING_WEIGHT_LOOKUP
      );
      const weightedMatchingEndings = weightedAvailableEndings
         .map<Weighted<RegularString>>(ending => ({ ...ending, value: new RegularString(ending.value) }))
         .filter(ending => input.ending(ending.value.length, true).doesMatch(ending.value));

      const regular = input.clone();
      if (weightedMatchingEndings.length) {
         const chosenEnding = RandomUtils.randomIndexWeighted2(weightedMatchingEndings);
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
