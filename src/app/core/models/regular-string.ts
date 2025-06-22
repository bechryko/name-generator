import { replaceLetter } from "@ngen-core/functions";
import { LetterUtils, RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { RegularCharacter } from "./regular-character";

export class RegularString {
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

   private readonly characters: RegularCharacter[] = [];

   constructor(str?: string) {
      if (!str) {
         return;
      }

      this.characters.push(...this.parseString(str));
   }

   public append(str: string | RegularString): void {
      const regular = typeof str === "string" ? new RegularString(str) : str;
      this.characters.push(...regular.characters);
   }

   public substring(start: number, end?: number): RegularString {
      return new RegularString(this.toString().substring(start, end));
   }

   public ending(size: number): RegularString {
      return this.substring(this.length - size);
   }

   public doesMatch(other: string | RegularString): boolean {
      if (other.length > this.length) {
         return false;
      }

      const regularOther = typeof other === "string" ? new RegularString(other) : other;
      for (let i = 0; i < this.length; i++) {
         if (!this.characters[i].doesMatch(regularOther.characters[i])) {
            return false;
         }
      }
      return true;
   }

   public match(other: string | RegularString, startIndex = 0): void {
      if (other.length > this.length) {
         throw new Error("Matched ending's length is larger than the length of this!");
      }

      const regularOther = typeof other === "string" ? new RegularString(other) : other;
      for (let i = 0; i < regularOther.length && i + startIndex < this.length; i++) {
         const char = this.characters[i + startIndex];
         const otherChar = regularOther.characters[i];
         if (!char.doesMatch(otherChar)) {
            throw new Error(
               `Cannot match '${regularOther.toString()}' to '${this.toString()}' from position ${startIndex}!`
            );
         }

         const matchedCharacter = char.priority > otherChar.priority ? char : otherChar.clone();
         this.characters[i + startIndex] = matchedCharacter;
      }
   }

   public getCharacters(): RegularCharacter[] {
      return [...this.characters];
   }

   public get length(): number {
      return this.characters.length;
   }

   public toString(): string {
      return this.characters.map(c => String(c)).join("");
   }

   public clone(): RegularString {
      return new RegularString(this.toString());
   }

   private parseString(str: string): RegularCharacter[] {
      return RegularString.deleteNonRegulars(RegularString.fixReferences(str.toLowerCase()))
         .split("")
         .map(char => new RegularCharacter(char));
   }
}
