import { last } from "@ngen-core/functions";

interface RandomBetweenConfig {
   isMaxIncluded?: boolean;
   isInteger?: boolean;
}

/**
 * Utilities for randomization.
 * Should be used instead of a plain Math.random().
 */
export class RandomUtils {
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
      if(config.isInteger) {
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
    * Gives a random element from an Array based on given weights.
    * The element array's indexes correspond to the weight array's indexes.
    * 
    * @param array a source array
    * @param weights an array of weights (their sum is not necessarily 1)
    * @returns a random element based on the weights
    */
   public static randomIndexWeighted<T>(array: T[], weights: number[]): T {
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      const randomWeight = this.between(0, totalWeight, { isInteger: false, isMaxIncluded: false });
      let weightSum = 0;
      for(let i = 0; i < array.length; i++) {
         weightSum += weights[i];
         if(randomWeight < weightSum) {
            return array[i];
         }
      }
      return last(array);
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
