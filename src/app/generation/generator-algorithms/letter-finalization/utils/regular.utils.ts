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
      return Object.values(this.symbols).includes(letter as any);
   }

   public static isReference(letter: string): boolean {
      return !isNaN(Number(letter));
   }

   public static matchRegular(regular: string, regularToMatch: string): string | false {
      let matching = "";
      for (let i = 0; i < regular.length; i++) {
         if (this.isReference(regular[i]) || this.isReference(regularToMatch[i])) {
            return false;
         }
         if (regular[i] === regularToMatch[i]) {
            matching += regular[i];
            continue;
         }
         const [ isWildcard, other0 ] = this.either(regular[i], regularToMatch[i], this.symbols.wildcard);
         if (isWildcard) {
            matching += other0;
            continue;
         }
         const [ isVowel, other1 ] = this.either(regular[i], regularToMatch[i], this.symbols.vowel);
         if(isVowel && LetterUtils.is('vowel', other1)) {
            matching += other1;
            continue;
         }
         const [ isConsonant, other2 ] = this.either(regular[i], regularToMatch[i], this.symbols.consonant);
         if(isConsonant && LetterUtils.is('consonant', other2)) {
            matching += other2;
            continue;
         }
         return false;
      }
      return matching;
   }

   private static either(regular1: string, regular2: string, letterToMatch: string): [ boolean, string ] {
      if(regular1 === letterToMatch) {
         return [ true, regular2 ];
      }
      if(regular2 === letterToMatch) {
         return [ true, regular1 ];
      }
      return [ false, "" ];
   }
}
