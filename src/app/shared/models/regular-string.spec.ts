import { RegularString } from "./regular-string";

describe("RegularString", () => {
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
