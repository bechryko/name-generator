import { Letter, LetterSet } from "@ngen-shared/models";
import { LetterUtils } from "./letter.utils";

function findLetter(letter: string): Letter {
   return LetterUtils["letter"].find(l => l.letter === letter)!;
}

describe("LetterUtils", () => {
   describe("getVowelChance", () => {
      it("should calculate vowel change correctly", () => {
         const chance = LetterUtils.getVowelChance({
            includedLetters: new LetterSet("abc"),
            excludedLetters: new LetterSet(),
            disableLetterWeights: false
         });

         const expectedChange =
            findLetter("a").weight / (findLetter("a").weight + findLetter("b").weight + findLetter("c").weight);
         expect(chance).toBe(expectedChange);
      });
   });
});
