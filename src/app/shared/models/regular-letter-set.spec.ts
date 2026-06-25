import { describe, expect, it } from "vitest";
import { RegularCharacter } from "./regular-character";
import { RegularLetterSet } from "./regular-letter-set";

describe("RegularLetterSet", () => {
   const set = new RegularLetterSet([new RegularCharacter("b"), new RegularCharacter("c")]);

   describe("doesMatch", () => {
      it("should return true for basic regular with a type it contains", () => {
         const otherChar = new RegularCharacter("-");

         expect(set.doesMatch(otherChar)).toBe(true);
         expect(otherChar.doesMatch(set)).toBe(true);
      });

      it("should return true for an exactly same set", () => {
         const otherSet = new RegularLetterSet([new RegularCharacter("b"), new RegularCharacter("c")]);

         expect(set.doesMatch(otherSet)).toBe(true);
         expect(otherSet.doesMatch(set)).toBe(true);
      });

      it("should return true for a set which it has common character with", () => {
         const otherSet = new RegularLetterSet([new RegularCharacter("a"), new RegularCharacter("b")]);

         expect(set.doesMatch(otherSet)).toBe(true);
         expect(otherSet.doesMatch(set)).toBe(true);
      });
   });
});
