import { pluck } from "@ngen-shared/functions";
import { RandomUtils } from "@ngen-shared/utils";
import { GenerationConfig, Letter, RandomLetterConfig } from "../models";

type LetterType = "vowel" | "consonant" | "letter";

type GetVowelChanceConfig = Pick<GenerationConfig, "includedLetters" | "excludedLetters" | "disableLetterWeights">;

export class LetterUtils {
   private static readonly DEFAULT_VOWEL_CHANCE = 3 / 8;

   private static readonly vowel: Letter[] = [
      { letter: "a", weight: 43.31 },
      { letter: "e", weight: 56.88 },
      { letter: "i", weight: 38.45 },
      { letter: "o", weight: 36.51 },
      { letter: "u", weight: 18.51 }
   ];
   private static readonly consonant: Letter[] = [
      { letter: "b", weight: 10.56 },
      { letter: "c", weight: 23.13 },
      { letter: "d", weight: 17.25 },
      { letter: "f", weight: 9.24 },
      { letter: "g", weight: 12.59 },
      { letter: "h", weight: 15.31 },
      { letter: "j", weight: 1 },
      { letter: "k", weight: 5.61 },
      { letter: "l", weight: 27.98 },
      { letter: "m", weight: 15.36 },
      { letter: "n", weight: 33.92 },
      { letter: "p", weight: 16.14 },
      { letter: "q", weight: 1 },
      { letter: "r", weight: 38.64 },
      { letter: "s", weight: 29.23 },
      { letter: "t", weight: 35.43 },
      { letter: "v", weight: 5.13 },
      { letter: "w", weight: 6.57 },
      { letter: "x", weight: 1.48 },
      { letter: "y", weight: 9.06 },
      { letter: "z", weight: 1.39 }
   ];
   private static readonly letter = this.vowel.concat(this.consonant).sort((a, b) => a.letter.localeCompare(b.letter));

   public static random(type: LetterType, config: RandomLetterConfig = {}): string {
      let array = this[type];
      if (config.excluded) {
         array = array.filter(l => !config.excluded!.includes(l.letter));
      }
      if (config.included) {
         array = array.filter(l => config.included!.includes(l.letter));
      }

      if (config.disableLetterWeights) {
         return RandomUtils.randomIndex(pluck(array, "letter"));
      }
      return RandomUtils.randomIndexWeighted(pluck(array, "letter"), pluck(array, "weight"));
   }

   public static getVowelChance(config: GetVowelChanceConfig): number {
      if (config.disableLetterWeights) {
         return this.DEFAULT_VOWEL_CHANCE;
      }

      const usableVowels = this.vowel.filter(
         v =>
            !config.excludedLetters.has(v.letter) &&
            (config.includedLetters.isEmpty() || config.includedLetters.has(v.letter))
      );
      const usableLetters = this.letter.filter(
         l =>
            !config.excludedLetters.has(l.letter) &&
            (config.includedLetters.isEmpty() || config.includedLetters.has(l.letter))
      );
      return usableVowels.reduce((acc, v) => acc + v.weight, 0) / usableLetters.reduce((acc, l) => acc + l.weight, 0); //TODO: pluckSum function
   }

   /**
    * Counts the number of letters of the given type.
    *
    * @param type the letter type to count
    * @param name the name whose letters to count. If omitted, all available letters of the given type will be counted
    * @returns the count number
    */
   public static numberOf(type: LetterType, name?: string): number {
      if (!name) {
         return this[type].length;
      }
      return name.split("").filter(l => this.is(type, l)).length;
   }

   /**
    * @param type the letter type to check
    * @param letter the letter to check
    * @returns whether the letter is of the given type
    */
   public static is(type: LetterType, letter: string): boolean {
      return pluck(this[type], "letter").includes(letter);
   }
}
