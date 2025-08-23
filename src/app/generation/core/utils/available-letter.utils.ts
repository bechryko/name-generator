import { getCharacterContainer } from "@ngen-shared/functions";
import { AvailableLetters } from "../models";
import { LetterUtils } from "./letter.utils";
import { RegularUtils } from "./regular.utils";

export class AvailableLetterUtils {
   public static filterByAvailableLetters(strings: string[], availableLetters: AvailableLetters): string[] {
      strings = strings
         .map(str => this.deleteUnavailableLetters(str, availableLetters))
         .filter(str => !str.includes(RegularUtils.symbols.setStart + RegularUtils.symbols.setEnd));

      if (!availableLetters.excludedLetters.isEmpty()) {
         strings = strings.filter(
            str => !availableLetters.excludedLetters.includesLetterFrom(LetterUtils.deleteNonLetters(str))
         );
      }
      if (!availableLetters.includedLetters.isEmpty()) {
         strings = strings.filter(str =>
            LetterUtils.deleteNonLetters(str)
               .split("")
               .every(letter => !LetterUtils.is("letter", letter) || availableLetters.includedLetters.has(letter))
         );
      }

      return strings;
   }

   private static deleteUnavailableLetters(str: string, availableLetters: AvailableLetters): string {
      let newStr = "";

      for (let i = 0; i < str.length; i++) {
         if (str[i] === RegularUtils.symbols.setStart) {
            const letterSet = getCharacterContainer(str, i, RegularUtils.symbols.setEnd);
            const deletedSet = this.deleteLettersFromSet(letterSet, availableLetters);
            newStr += `(${deletedSet})`;
            i += deletedSet.length + 1;
         } else {
            newStr += str[i];
         }
      }

      return newStr;
   }

   private static deleteLettersFromSet(letterSet: string, availableLetters: AvailableLetters): string {
      let letters = letterSet.split("");

      if (!availableLetters.excludedLetters.isEmpty()) {
         letters = letters.filter(letter => !availableLetters.excludedLetters.has(letter));
      }
      if (!availableLetters.includedLetters.isEmpty()) {
         letters = letters.filter(letter => availableLetters.includedLetters.has(letter));
      }

      return letters.join("");
   }
}
