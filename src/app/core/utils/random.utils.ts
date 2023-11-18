import { NgenArray } from "@ngen-core/models";

export class RandomUtils {
   public static between(min: number, max: number): number {
      return this.randomNumber() * (max - min) + min;
   }

   public static randomIndex<T>(array: T[]): T {
      return array[Math.floor(this.between(0, array.length))];
   }

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

   public static byChance(chance: number): boolean {
      return this.randomNumber() < chance;
   }

   private static randomNumber(): number {
      return Math.random();
   }
}
