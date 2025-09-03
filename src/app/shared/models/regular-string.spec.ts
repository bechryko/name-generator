import { RegularString } from "./regular-string";

describe("RegularString", () => {
   describe("constructor", () => {
      it("should create regular string from correctly formatted string", () => {
         const correctlyFormattedStrings = ["a-+1", "+0-**", "**{e1}-", "*************{11}"];

         for (const str of correctlyFormattedStrings) {
            const regular = new RegularString(str);

            expect(regular.toString()).withContext(`string: ${str}`).toEqual(str);
         }
      });

      it("should replace invalid characters with wildcards", () => {
         const str = "?~ő😇";

         const regular = new RegularString(str);

         const expected = Array.from({ length: str.length }, () => "*").join("");
         expect(regular.toString()).toEqual(expected);
      });

      it("should replace invalid references with wildcards", () => {
         const regular = new RegularString("9{-1}2");

         expect(regular.toString()).toEqual("***");
      });

      it("should delete invalid regular group characters", () => {
         const regular = new RegularString("a)*((bc)*{d");

         expect(regular.toString()).toEqual("a*(bc)*d");
      });

      it("should replace invalid regular groups with wildcards", () => {
         const regular = new RegularString("{b}+{l8}");

         expect(regular.toString()).toEqual("*+*");
      });

      it("should switch reference order if needed", () => {
         const regular = new RegularString("-2+");

         expect(regular.toString()).toEqual("-+1");
      });

      it("should reduce 1-member sets to characters", () => {
         const regular = new RegularString("*(a)*");

         expect(regular.toString()).toEqual("*a*");
      });

      it("should format sets as letter sets", () => {
         const regular = new RegularString("(aaab)(cd8+😋)");

         expect(regular.toString()).toEqual("(ab)(cd)");
      });
   });

   describe("match", () => {
      it("should correctly match regular symbols", () => {
         const regular = new RegularString("**-+");
         const regularToMatch = "++-*";

         regular.match(regularToMatch);

         expect(regular.toString()).toEqual("++-+");
      });

      it("should correctly match regulars with letters", () => {
         const regular = new RegularString("a**-+");
         const regularToMatch = "+*+-a";

         regular.match(regularToMatch);

         expect(regular.toString()).toEqual("a*+-a");
      });

      it("should correctly match regulars with references", () => {
         const regular = new RegularString("+0**");
         const regularToMatch = "+*-*";

         regular.match(regularToMatch);

         expect(regular.toString()).toEqual("+0-*");
      });
   });
});
