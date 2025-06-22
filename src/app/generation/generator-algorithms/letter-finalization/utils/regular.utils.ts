export class RegularUtils {
   public static readonly symbols = {
      vowel: "+",
      consonant: "-",
      wildcard: "*"
   } as const;

   public static isRegular(letter: string): boolean {
      return this.isBasicRegular(letter) || this.isReference(letter);
   }

   public static isBasicRegular(letter: string): boolean {
      return Object.values(this.symbols).includes(letter as any);
   }

   public static isReference(letter: string): boolean {
      return !isNaN(Number(letter));
   }
}
