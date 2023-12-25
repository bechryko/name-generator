import { RandomUtils } from "./random.utils";

describe('RandomUtils', () => {
   describe('randomIndexWeighted', () => {
      it('should pick random array element based on weights', () => {
         const array = [1, 2, 3, 4];
         const weights = [1, 2, 3, 4];
         const weightsSum = weights.reduce((a, b) => a + b, 0);
         const testPrecision = 1;

         const results = new Array(array.length).fill(0);
         const generatedNumbers = 1_000_000;
         for (let i = 0; i < generatedNumbers; i++) {
            results[RandomUtils.randomIndexWeighted(array, weights) - 1]++;
         }
         const sum = results.reduce((a, b) => a + b, 0);
         for (let idx = 0; idx < results.length; idx++) {
            console.log(`chance of ${idx + 1}: ${results[idx] / weightsSum}`);
            expect(results[idx] / sum)
               .withContext(`distribution of ${idx + 1} is nearly correct`)
               .toBeCloseTo(weights[idx] / weightsSum, testPrecision);
         }
      });
   });
});
