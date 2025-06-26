import { LetterUtils, RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { LetterSet, RegularString } from "@ngen-shared/models";
import { RandomUtils } from "@ngen-shared/utils";
import { AlgorithmDataType, AlgorithmPart, GenerationData } from "../models";

export interface NameEndingApplierConfig {
   excludedLetters: LetterSet;
   includedLetters: LetterSet;
}

export class NameEndingApplier extends AlgorithmPart<
   AlgorithmDataType.REGULAR_STRING,
   AlgorithmDataType.REGULAR_STRING,
   {}
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
      const matchingEndings = this.getFilteredNameEndings(config).filter(ending =>
         input.ending(ending.length, true).doesMatch(ending)
      );
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

   private getFilteredNameEndings(config: NameEndingApplierConfig): string[] {
      let endings = NameEndingApplier.NAME_ENDINGS;
      if (!config.excludedLetters.isEmpty()) {
         endings = endings.filter(ending => !config.excludedLetters.includesLetterFrom(ending));
      }
      if (!config.includedLetters.isEmpty()) {
         endings = endings.filter(ending =>
            ending
               .split("")
               .every(
                  endingLetter => !LetterUtils.is("letter", endingLetter) || config.includedLetters.has(endingLetter)
               )
         );
      }
      return endings;
   }
}
