import { capitalize, replaceLetter } from "@ngen-core/functions";
import { LetterUtils, RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";

export class InputFormatUtils {
   public static formatLetterSetInput(input: string): string {
      input = input.toLowerCase();
      input = this.deleteNonLetters(input);
      input = this.deleteDuplicateCharacters(input);
      input = this.sortCharacters(input);
      return input;
   }

   public static formatRegularInput(input: string, nameStarting = false): string {
      input = input.toLowerCase();
      input = this.fixReferences(input);
      input = this.deleteNonRegulars(input);
      if(nameStarting) {
         input = capitalize(input);
      }
      return input;
   }

   private static deleteNonLetters(input: string): string {
      let output = "";
      for(let i = 0; i < input.length; i++) {
         if(LetterUtils.is('letter', input[i])) {
            output += input[i];
         }
      }
      return output;
   }

   private static deleteNonRegulars(input: string): string {
      let output = "";
      for(let i = 0; i < input.length; i++) {
         if(LetterUtils.is('letter', input[i]) || RegularUtils.isRegular(input[i])) {
            output += input[i];
         }
      }
      return output;
   }

   private static fixReferences(input: string): string {
      let referenceRegular = "";
      const referencingSets: Set<number>[] = [];
      for(let i = 0; i < input.length; i++) {
         referencingSets[i] = new Set();
      }
      for(let i = 0; i < input.length; i++) {
         if(RegularUtils.isReference(input[i])) {
            const referenceTo = Number(input[i]);
            if(referenceTo === i) {
               referenceRegular += RegularUtils.symbols.wildcard;
            } else if(referenceTo < input.length) {
               if(referenceTo > i) {
                  referencingSets[referenceTo].add(i);
               } else {
                  referencingSets[i].add(referenceTo);
               }
               referenceRegular += RegularUtils.symbols.reference;
            }
         } else {
            referenceRegular += input[i];
         }
      }
      for(let i = referencingSets.length - 1; i >= 0; i--) {
         if(referencingSets[i].size <= 1) {
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
      for(let i = 0; i < referenceRegular.length; i++) {
         if(referenceRegular[i] === RegularUtils.symbols.reference) {
            output += referencingNumbers[i] ?? RegularUtils.symbols.wildcard;
         } else if(referencingNumbers[i] === undefined) {
            output += referenceRegular[i];
         } else {
            const letterToReference = referenceRegular[i];
            let idx = i;
            while(referencingNumbers[idx] !== undefined) {
               idx = referencingNumbers[idx]!;
            }
            output = replaceLetter(output, idx, letterToReference) + referencingNumbers[i];
         }
      }
      return output;
   }

   private static deleteDuplicateCharacters(input: string): string {
      let output = "";
      for(let i = 0; i < input.length; i++) {
         if(!output.includes(input[i])) {
            output += input[i];
         }
      }
      return output;
   }

   private static sortCharacters(input: string): string {
      return input.split("").sort().join("");
   }
}
