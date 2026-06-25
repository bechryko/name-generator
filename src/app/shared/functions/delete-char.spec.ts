import { describe, expect, it } from "vitest";
import { deleteChar } from "./delete-char";

describe("deleteChar", () => {
   it("should delete character from valid position", () => {
      expect(deleteChar("asd", 1)).toEqual("ad");
      expect(deleteChar("qwertzuiop", 5)).toEqual("qwertuiop");
      expect(deleteChar("lkj", 2)).toEqual("lk");
      expect(deleteChar("f", 0)).toEqual("");
   });

   it("should not change the string if the position is invalid", () => {
      expect(deleteChar("asd", 4)).toEqual("asd");
      expect(deleteChar("vbn", -1)).toEqual("vbn");
      expect(deleteChar("", 0)).toEqual("");
   });
});
