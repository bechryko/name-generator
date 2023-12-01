import { LetterUtils } from "./letter.utils";

export class RegularUtils {
   public static readonly symbols = {
      vowel: '+',
      consonant: '-',
      reference: '&',
      wildcard: '*'
   } as const;

   public static isRegular(letter: string): boolean {
      return this.isBasicRegular(letter) || this.isReference(letter);
   }

   public static isBasicRegular(letter: string): boolean {
      for (const key in this.symbols) {
         if (this.symbols[key as keyof typeof this.symbols] === letter) {
            return true;
         }
      }
      return false;
   }

   public static isReference(letter: string): boolean {
      return !isNaN(Number(letter));
   }

   public static matchRegular(regular: string, pureRegularToMatch: string): boolean {
      const pureRegular = this.convertToPureRegular(regular);
      for (let i = 0; i < pureRegular.length; i++) {
         if (pureRegular[i] === pureRegularToMatch[i]) {
            continue;
         }
         if (pureRegular[i] === this.symbols.wildcard || pureRegularToMatch[i] === this.symbols.wildcard) {
            continue;
         }
         return false;
      }
      return true;
   }

   private static convertToPureRegular(regular: string): string {
      let pureRegular = "";
      for (let i = 0; i < regular.length; i++) {
         if (this.isReference(regular[i])) {
            pureRegular += pureRegular[Number(regular[i])];
         } else if (LetterUtils.is('vowel', regular[i])) {
            pureRegular += this.symbols.vowel;
         } else if (LetterUtils.is('consonant', regular[i])) {
            pureRegular += this.symbols.consonant;
         } else {
            pureRegular += regular[i];
         }
      }
      return pureRegular;
   }
}
