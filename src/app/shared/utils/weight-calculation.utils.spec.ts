import { describe, expect, it } from "vitest";
import { WeightCalculationUtils } from "./weight-calculation.utils";

describe("WeightCalculationUtils", () => {
   describe("getWeightLookupForRegularTemplates", () => {
      it("should create lookup for regular templates", () => {
         const simpleTemplate = "abc";
         const templateWithOneLetterSet = "ab(cd)";
         const templateWithMultipleLetterSets = "ab(cd)(ef)(gh)";
         const templates = [simpleTemplate, templateWithOneLetterSet, templateWithMultipleLetterSets];

         const lookup = WeightCalculationUtils.getWeightLookupForRegularTemplates(templates);

         expect(lookup[simpleTemplate], "simple template").toBe(1);
         expect(lookup[templateWithOneLetterSet], "template with 1 letter set").toBe(2);
         expect(lookup[templateWithMultipleLetterSets], "template with multiple letter sets").toBe(8);
      });
   });
});
