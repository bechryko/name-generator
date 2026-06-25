import { describe, expect, it } from "vitest";
import { getCharacterContainer } from "./get-character-container";

describe("getCharacterContainer", () => {
   it("should correctly find the container", () => {
      expect(getCharacterContainer("asd(fgh)jkl", 3, ")")).toEqual("fgh");
      expect(getCharacterContainer("asd(fgh)jkl(yxc)vbn", 11, ")")).toEqual("yxc");
   });

   it("should throw error if the container is not closed", () => {
      let hasError = false;
      try {
         getCharacterContainer("asd(fgh", 3, ")");
      } catch (error) {
         hasError = true;
      }
      expect(hasError).toBe(true);
   });
});
