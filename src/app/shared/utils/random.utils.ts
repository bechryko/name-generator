import { last } from "@ngen-shared/functions";
import { Weighted } from "@ngen-shared/models";
import seedRandom from "seed-random";

interface RandomBetweenConfig {
   isMaxIncluded?: boolean;
   isInteger?: boolean;
}

/**
 * Utilities for randomization.
 * Should be used instead of a plain Math.random().
 */
export class RandomUtils {
   public static setSeed(seed: string): void {
      seedRandom(seed, { global: true });
   }

   public static clearSeed(): void {
      seedRandom.resetGlobal();
   }

   /**
    * Generates a random number in the given interval.
    *
    * The configuration has two options: isMaxIncluded and isInteger. They both default to true.
    *
    * @param min the minimum number to be possibly generated (included)
    * @param max the maximum number to be possibly generated (configurable)
    * @param config configuration for the random number
    * @returns a number between min and max
    */
   public static between(min: number, max: number, config?: RandomBetweenConfig): number {
      config = {
         isMaxIncluded: config?.isMaxIncluded ?? true,
         isInteger: config?.isInteger ?? true
      };
      const random = this.randomNumber() * (max + Number(config.isMaxIncluded) - min) + min;
      if (config.isInteger) {
         return Math.floor(random);
      }
      return random;
   }

   /**
    * Gives a pure random element from an Array.
    *
    * @param array a source array
    * @returns a random element
    */
   public static randomIndex<T>(array: T[]): T {
      return array[this.between(0, array.length, { isMaxIncluded: false })];
   }

   /**
    * Gives a random element from an Array of weighted elements.
    *
    * @param array a source array with elements of `Weighted` interface
    * @returns a random element based on the weights
    */
   public static randomIndexWeighted<T>(array: Weighted<T>[]): T {
      const totalWeight = array.reduce((sum, element) => sum + element.weight, 0);
      const randomWeight = this.between(0, totalWeight, { isInteger: false, isMaxIncluded: false });

      let weightSum = 0;
      for (let i = 0; i < array.length; i++) {
         weightSum += array[i].weight;
         if (randomWeight < weightSum) {
            return array[i].value;
         }
      }

      return last(array).value;
   }

   /**
    * Tests randomly to pass the given chance.
    *
    * @param chance a stochastic chance
    * @returns whether the test passed
    */
   public static byChance(chance: number): boolean {
      return this.randomNumber() < chance;
   }

   private static randomNumber(): number {
      return Math.random();
   }
}
