import { replaceLetter } from "@ngen-core/functions";
import { RegularCharacter, RegularReference } from "@ngen-core/models";
import { LetterUtils } from "./letter.utils";

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

   public static parseStringToRegularCharacters(str: string): RegularCharacter[] {
      return this.deleteNonRegulars(this.fixReferences(str.toLowerCase()))
         .split("")
         .map(char => {
            if (this.isReference(char)) {
               return new RegularReference(Number(char));
            } else {
               return new RegularCharacter(char);
            }
         });
   }

   private static deleteNonRegulars(input: string): string {
      let output = "";
      for (let i = 0; i < input.length; i++) {
         if (LetterUtils.is("letter", input[i]) || RegularUtils.isRegular(input[i])) {
            output += input[i];
         } else {
            output += RegularUtils.symbols.wildcard;
         }
      }
      return output;
   }

   private static fixReferences(input: string): string {
      let referenceRegular = "";
      const referencingSets: Set<number>[] = [];

      for (let i = 0; i < input.length; i++) {
         referencingSets[i] = new Set();
      }
      for (let i = 0; i < input.length; i++) {
         if (RegularUtils.isReference(input[i])) {
            const referenceTo = Number(input[i]);
            if (referenceTo === i || referenceTo >= input.length) {
               referenceRegular += RegularUtils.symbols.wildcard;
               continue;
            } else {
               if (referenceTo > i) {
                  referencingSets[referenceTo].add(i);
               } else {
                  referencingSets[i].add(referenceTo);
               }
            }
         }
         referenceRegular += input[i];
      }

      for (let i = referencingSets.length - 1; i >= 0; i--) {
         if (referencingSets[i].size <= 1) {
            continue;
         }
         const references = referencingSets[i];
         const nextReferenceInChain = Math.max(...Array.from(references));
         referencingSets[i] = new Set([nextReferenceInChain]);
         references.delete(nextReferenceInChain);
         references.forEach(ref => referencingSets[nextReferenceInChain].add(ref));
      }

      const referencingNumbers: (number | undefined)[] = referencingSets.map(references => Array.from(references)[0]);
      let output = "";
      for (let i = 0; i < referenceRegular.length; i++) {
         if (RegularUtils.isReference(referenceRegular[i])) {
            output += referencingNumbers[i] ?? RegularUtils.symbols.wildcard;
         } else if (referencingNumbers[i] === undefined) {
            output += referenceRegular[i];
         } else {
            const letterToReference = referenceRegular[i];
            let idx = i;
            while (referencingNumbers[idx] !== undefined) {
               idx = referencingNumbers[idx]!;
            }
            output = replaceLetter(output, idx, letterToReference) + referencingNumbers[i];
         }
      }
      return output;
   }
}
