import { NgenArray } from "@ngen-core/models";

/**
 * Utilities for randomization.
 * Should be used instead of a plain Math.random().
 */
export class RandomUtils {
   /**
    * Generates a random number in the given interval.
    * 
    * @param min the minimum number to be possibly generated (included)
    * @param max the maximum number to be possibly generated (excluded)
    * @returns a number between min and max
    */
   public static between(min: number, max: number): number {
      return this.randomNumber() * (max - min) + min;
   }

   /**
    * Gives a pure random element from an Array.
    * 
    * @param array a source array
    * @returns a random element
    */
   public static randomIndex<T>(array: T[]): T {
      return array[Math.floor(this.between(0, array.length))];
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
      const randomWeight = this.between(0, totalWeight);
      let weightSum = 0;
      for(let i = 0; i < array.length; i++) {
         weightSum += weights[i];
         if(randomWeight < weightSum) {
            return array[i];
         }
      }
      return (array as NgenArray<T>).last();
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
