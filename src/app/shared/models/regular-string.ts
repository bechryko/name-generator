import { deleteChar, getCharacterContainer } from "../functions";
import { LetterUtils, RegularUtils } from "../utils";
import { RegularCharacter } from "./regular-character";
import { RegularLetterSet } from "./regular-letter-set";
import { RegularReference } from "./regular-reference";

export class RegularString {
   private static parseStringToRegularCharacters(str: string): RegularCharacter[] {
      const parsedString = this.deleteNonRegulars(str.toLowerCase());
      const parsedValidRegularString = this.deleteInvalidRegulars(parsedString);
      const regularCharacterBases = this.splitToRegularCharacterBases(parsedValidRegularString);
      const regularCharacterBasesWithFixedReferences = this.fixReferences(regularCharacterBases);
      return regularCharacterBasesWithFixedReferences.map(char => {
         if (RegularUtils.isReference(char)) {
            const { referenceIndex, isExternal } = RegularUtils.extractReferenceData(char);
            return new RegularReference(referenceIndex, isExternal);
         } else if (char.length > 1) {
            const characters = char
               .split("")
               .filter(c => LetterUtils.is("letter", c))
               .map(c => new RegularCharacter(c));
            return new RegularLetterSet(characters);
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

   private static deleteInvalidRegulars(input: string): string {
      let groupDepth = 0;
      let lastGroupStartPos = -1;
      let setDepth = 0;
      let lastSetStartPos = -1;
      let output = "";

      for (let i = 0; i < input.length; i++) {
         const char = input[i];

         switch (char) {
            case RegularUtils.symbols.groupStart:
               groupDepth++;
               lastGroupStartPos = i;
               break;
            case RegularUtils.symbols.groupEnd:
               groupDepth--;
               break;
            case RegularUtils.symbols.setStart:
               setDepth++;
               lastSetStartPos = i;
               break;
            case RegularUtils.symbols.setEnd:
               setDepth--;
               break;
         }

         if (groupDepth < 0 || setDepth < 0 || groupDepth > 1 || setDepth > 1 || groupDepth + setDepth === 2) {
            continue;
         }

         output += char;
      }

      if (groupDepth === 1) {
         output = deleteChar(output, lastGroupStartPos);
      } else if (setDepth === 1) {
         output = deleteChar(output, lastSetStartPos);
      }

      return output;
   }

   private static splitToRegularCharacterBases(str: string): string[] {
      const characters: string[] = [];

      for (let i = 0; i < str.length; i++) {
         if (str[i] === RegularUtils.symbols.groupStart) {
            const container = getCharacterContainer(str, i, RegularUtils.symbols.groupEnd);
            characters.push(container);
            i += container.length + 1;
         } else if (str[i] === RegularUtils.symbols.setStart) {
            const container = getCharacterContainer(str, i, RegularUtils.symbols.setEnd);
            characters.push(container);
            i += container.length + 1;
         } else {
            characters.push(str[i]);
         }
      }

      return characters;
   }

   private static fixReferences(input: string[]): string[] {
      const referenceRegularChars: string[] = [];
      const referencingSets: Set<number>[] = [];

      for (let i = 0; i < input.length; i++) {
         referencingSets[i] = new Set();
      }
      for (let i = 0; i < input.length; i++) {
         if (RegularUtils.isReference(input[i], false)) {
            const referenceTo = Number(input[i]);
            if (referenceTo === i || referenceTo >= input.length) {
               referenceRegularChars.push(RegularUtils.symbols.wildcard);
               continue;
            } else {
               if (referenceTo > i) {
                  referencingSets[referenceTo].add(i);
               } else {
                  referencingSets[i].add(referenceTo);
               }
            }
         }
         referenceRegularChars.push(input[i]);
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
      const output: string[] = [];
      for (let i = 0; i < referenceRegularChars.length; i++) {
         if (RegularUtils.isReference(referenceRegularChars[i], false)) {
            output.push(String(referencingNumbers[i]) ?? RegularUtils.symbols.wildcard);
         } else if (referencingNumbers[i] === undefined) {
            output.push(referenceRegularChars[i]);
         } else {
            const letterToReference = referenceRegularChars[i];
            let idx = i;
            while (referencingNumbers[idx] !== undefined) {
               idx = referencingNumbers[idx]!;
            }
            output[idx] = letterToReference;
            output.push(String(referencingNumbers[i]));
         }
      }
      return output;
   }

   private readonly characters: RegularCharacter[] = [];

   constructor(str?: string) {
      if (!str) {
         return;
      }

      this.characters.push(...RegularString.parseStringToRegularCharacters(str));
      this.assignReferences();
   }

   public append(str: string | RegularString): void {
      const regular = typeof str === "string" ? new RegularString(str) : str;
      this.characters.push(...regular.getCharacters(true));
      this.assignReferences();
   }

   public substring(start: number, end?: number, cutReferences = false): RegularString {
      const subRegular = new RegularString();
      subRegular.characters.push(...this.characters.slice(start, end).map(c => c.clone()));
      if (!cutReferences) {
         subRegular.assignReferences();
      }
      return subRegular;
   }

   public ending(size: number, cutReferences = false): RegularString {
      return this.substring(this.length - size, undefined, cutReferences);
   }

   public doesMatch(other: RegularString): boolean {
      if (other.length > this.length) {
         return false;
      }

      for (let i = 0; i < this.length; i++) {
         if (!this.characters[i].doesMatch(other.characters[i])) {
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

         this.characters[i + startIndex] = this.getMatchedCharacter(char, otherChar);
      }
   }

   public getCharacters(clone = false): RegularCharacter[] {
      if (clone) {
         return this.characters.map(c => c.clone());
      }
      return [...this.characters];
   }

   public get length(): number {
      return this.characters.length;
   }

   public getValue(): string {
      return this.characters.map(c => c.getValue()).join("");
   }

   public toString(): string {
      return this.characters.map(c => c.toString()).join("");
   }

   public clone(): RegularString {
      return new RegularString(this.toString());
   }

   private assignReferences(): void {
      this.characters.forEach((char, index) => {
         if (char instanceof RegularReference) {
            const success = char.assignRegularString(this);
            if (!success) {
               this.characters[index] = new RegularCharacter(char.getValue());
            }
         }
      });
   }

   private getMatchedCharacter(c1: RegularCharacter, c2: RegularCharacter): RegularCharacter {
      if (c1 instanceof RegularLetterSet && c2 instanceof RegularLetterSet) {
         return RegularLetterSet.match(c1, c2);
      }

      if (c1 instanceof RegularLetterSet || c2 instanceof RegularLetterSet) {
         const set = (c1 instanceof RegularLetterSet ? c1 : c2).clone() as RegularLetterSet;
         set.match(c2);
         return set;
      }

      return c1.priority > c2.priority ? c1.clone() : c2.clone();
   }
}
