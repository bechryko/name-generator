import { Weighted } from "@ngen-shared/models";
import { describe, expect, it } from "vitest";
import { RandomUtils } from "./random.utils";

describe("RandomUtils", () => {
   describe("randomIndexWeighted", () => {
      it("should pick random array element based on weights", () => {
         const array: Weighted<number>[] = Array.from({ length: 4 }, (_, index) => ({
            value: index + 1,
            weight: index + 1
         }));
         const weightsSum = array.reduce((sum, element) => sum + element.weight, 0);
         const testPrecision = 1;

         const results = new Array(array.length).fill(0);
         const generatedNumbers = 1000000;
         for (let i = 0; i < generatedNumbers; i++) {
            results[RandomUtils.randomIndexWeighted(array) - 1]++;
         }
         const sum = results.reduce((a, b) => a + b, 0);
         for (let idx = 0; idx < results.length; idx++) {
            console.log(`chance of ${idx + 1}: ${results[idx] / weightsSum}`);
            expect(results[idx] / sum, `distribution of ${idx + 1} is nearly correct`).toBeCloseTo(
               (idx + 1) / weightsSum,
               testPrecision
            );
         }
      });
   });
});
