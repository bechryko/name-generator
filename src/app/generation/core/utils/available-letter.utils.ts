import { AvailableLetters } from "../models";
import { LetterUtils } from "./letter.utils";

export class AvailableLetterUtils {
   public static filterByAvailableLetters(array: string[], availableLetters: AvailableLetters): string[] {
      if (!availableLetters.excludedLetters.isEmpty()) {
         array = array.filter(str => !availableLetters.excludedLetters.includesLetterFrom(str));
      }
      if (!availableLetters.includedLetters.isEmpty()) {
         array = array.filter(str =>
            str
               .split("")
               .every(
                  endingLetter =>
                     !LetterUtils.is("letter", endingLetter) || availableLetters.includedLetters.has(endingLetter)
               )
         );
      }
      return array;
   }
}
