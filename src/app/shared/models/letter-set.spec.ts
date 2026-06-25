import { describe, expect, it } from "vitest";
import { LetterSet } from "./letter-set";

describe("LetterSet", () => {
   const formattedLetters = "abc";

   describe("constructor", () => {
      it("should parse formatted letter set", () => {
         const set = new LetterSet(formattedLetters);

         expect(set.toString()).toEqual(formattedLetters);
      });

      it("should parse unformatted letter set", () => {
         const letters = "asdasd-(87x";

         const set = new LetterSet(letters);

         expect(set.toString()).toEqual("adsx");
      });

      it("should create with empty parameters", () => {
         expect(new LetterSet().toString()).toEqual("");
      });

      it("should parse empty string", () => {
         expect(new LetterSet("").toString()).toEqual("");
      });
   });

   describe("add", () => {
      it("should add correct letters", () => {
         const set = new LetterSet();

         set.add("a");
         expect(set.toString(), "added letter 'a'").toEqual("a");

         set.add("y");
         expect(set.toString(), "added letter 'y'").toEqual("ay");

         set.add("k");
         expect(set.toString(), "added letter 'k'").toEqual("aky");
      });

      it("should not add duplicate letters", () => {
         const set = new LetterSet(formattedLetters);

         set.add("a");
         expect(set.toString(), "added letter 'a'").toEqual(formattedLetters);

         set.add("c");
         expect(set.toString(), "added letter 'c'").toEqual(formattedLetters);
      });

      it("should throw error from non-letters", () => {
         const set = new LetterSet(formattedLetters);

         let hasError = false;
         try {
            set.add("text");
         } catch (error) {
            hasError = true;
         }
         expect(hasError, "trying to add 'text'").toBe(true);

         hasError = false;
         try {
            set.add("7");
         } catch (error) {
            hasError = true;
         }
         expect(hasError, "trying to add '7'").toBe(true);

         hasError = false;
         try {
            set.add("*");
         } catch (error) {
            hasError = true;
         }
         expect(hasError, "trying to add '*'").toBe(true);
      });
   });
});
