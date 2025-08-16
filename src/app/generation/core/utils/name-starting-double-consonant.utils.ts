import { AvailableLetters } from "../models";
import { AvailableLetterUtils } from "./available-letter.utils";

export class NameStartingDoubleConsonantUtils {
   private static readonly NAME_STARTING_DOUBLE_CONSONANTS = [
      "tr",
      "th",
      "pr",
      "ph",
      "cr",
      "ch",
      "kr",
      "kh",
      "fr",
      "br",
      "vr",
      "wr",
      "ll",
      "sc",
      "st",
      "sm",
      "sn",
      "sl"
   ];

   public static getNameStartingDoubleConsonants(availableLetters: AvailableLetters): string[] {
      return AvailableLetterUtils.filterByAvailableLetters(this.NAME_STARTING_DOUBLE_CONSONANTS, availableLetters);
   }

   public static canStartWithDoubleConsonant(availableLetters: AvailableLetters): boolean {
      return this.getNameStartingDoubleConsonants(availableLetters).length > 0;
   }
}
