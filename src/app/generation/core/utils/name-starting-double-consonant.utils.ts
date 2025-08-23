import { AvailableLetters } from "../models";
import { AvailableLetterUtils } from "./available-letter.utils";

export class NameStartingDoubleConsonantUtils {
   private static readonly NAME_STARTING_DOUBLE_CONSONANTS = ["(cktp)(hr)", "(bfvw)r", "ll", "s(clmnt)"];

   public static getNameStartingDoubleConsonants(availableLetters: AvailableLetters): string[] {
      return AvailableLetterUtils.filterByAvailableLetters(this.NAME_STARTING_DOUBLE_CONSONANTS, availableLetters);
   }

   public static canStartWithDoubleConsonant(availableLetters: AvailableLetters): boolean {
      return this.getNameStartingDoubleConsonants(availableLetters).length > 0;
   }
}
