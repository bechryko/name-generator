export class RandomUtils {
   private static randomNumber(): number {
      return Math.random();
   }

   public static between(min: number, max: number, includeMax = true): number {
      return Math.floor(this.randomNumber() * (max - min + Number(includeMax))) + min;
   }

   public static randomIndex<T>(array: T[]): T {
      return array[this.between(0, array.length - 1)];
   }

   public static randomIndexWeighted<T>(array: T[], weights: number[]): T {
      let totalWeight = 0;
      weights.forEach(weight => totalWeight += weight);
      const randomWeight = this.between(0, totalWeight);
      let weightSum = 0;
      for (let i = 0; i < array.length; i++) {
            weightSum += weights[i];
            if (randomWeight <= weightSum) {
               return array[i];
            }
      }
      return array[array.length - 1];
   }
}
