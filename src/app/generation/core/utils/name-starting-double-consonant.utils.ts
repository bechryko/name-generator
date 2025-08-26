import { Weighted } from "@ngen-shared/models";
import { WeightCalculationUtils } from "@ngen-shared/utils";
import { AvailableLetters } from "../models";
import { AvailableLetterUtils } from "./available-letter.utils";

export class NameStartingDoubleConsonantUtils {
   private static readonly NAME_STARTING_DOUBLE_CONSONANTS = ["(cktp)(hr)", "(bfvw)r", "ll", "s(clmnt)"];
   private static DOUBLE_CONSONANT_WEIGHT_LOOKUP?: Record<string, number>;

   public static getNameStartingDoubleConsonants(availableLetters: AvailableLetters): Weighted<string>[] {
      const availableDoubleConsonants = AvailableLetterUtils.filterByAvailableLetters(
         this.NAME_STARTING_DOUBLE_CONSONANTS,
         availableLetters
      );

      if (!this.DOUBLE_CONSONANT_WEIGHT_LOOKUP) {
         this.DOUBLE_CONSONANT_WEIGHT_LOOKUP = WeightCalculationUtils.getWeightLookupForRegularTemplates(
            this.NAME_STARTING_DOUBLE_CONSONANTS
         );
      }

      return WeightCalculationUtils.addWeightByWeightLookup(
         availableDoubleConsonants,
         this.DOUBLE_CONSONANT_WEIGHT_LOOKUP
      );
   }

   public static canStartWithDoubleConsonant(availableLetters: AvailableLetters): boolean {
      return this.getNameStartingDoubleConsonants(availableLetters).length > 0;
   }
}
