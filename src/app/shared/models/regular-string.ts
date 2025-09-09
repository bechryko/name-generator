import { deleteChar, getCharacterContainer } from "../functions";
import { LetterUtils, RegularUtils } from "../utils";
import { RegularCharacter } from "./regular-character";
import { RegularLetterSet } from "./regular-letter-set";
import { RegularReference } from "./regular-reference";

interface RegularCharacterBase {
   text: string;
   context: "character" | "group" | "set";
}

export class RegularString {
   private static parseStringToRegularCharacters(str: string): RegularCharacter[] {
      const parsedString = this.deleteNonRegulars(str.toLowerCase());
      const parsedValidRegularString = this.deleteInvalidRegulars(parsedString);
      const regularCharacterBases = this.splitToRegularCharacterBases(parsedValidRegularString);
      const regularCharacterBasesWithFixedReferences = this.fixReferences(regularCharacterBases);
      return regularCharacterBasesWithFixedReferences.map(base => {
         switch (base.context) {
            case "group":
               const { referenceIndex, isExternal } = RegularUtils.extractReferenceData(base.text);
               return new RegularReference(referenceIndex, isExternal);
            case "set":
               const characters = base.text.split("").map(c => new RegularCharacter(c));
               return new RegularLetterSet(characters);
            case "character":
               return new RegularCharacter(base.text);
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

      for (let i = 0, j = 0; i < input.length; i++, j++) {
         const char = input[i];

         const [oldGroupDepth, oldSetDepth] = [groupDepth, setDepth];

         switch (char) {
            case RegularUtils.symbols.groupStart:
               groupDepth++;
               lastGroupStartPos = j;
               break;
            case RegularUtils.symbols.groupEnd:
               groupDepth--;
               break;
            case RegularUtils.symbols.setStart:
               setDepth++;
               lastSetStartPos = j;
               break;
            case RegularUtils.symbols.setEnd:
               setDepth--;
               break;
         }

         if (groupDepth < 0 || setDepth < 0 || groupDepth > 1 || setDepth > 1 || groupDepth + setDepth === 2) {
            [groupDepth, setDepth] = [oldGroupDepth, oldSetDepth];
            j--;
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

   private static splitToRegularCharacterBases(str: string): RegularCharacterBase[] {
      const characters: RegularCharacterBase[] = [];

      for (let i = 0; i < str.length; i++) {
         if (str[i] === RegularUtils.symbols.groupStart) {
            const container = getCharacterContainer(str, i, RegularUtils.symbols.groupEnd);
            characters.push({
               text: container,
               context: "group"
            });
            i += container.length + 1;
         } else if (str[i] === RegularUtils.symbols.setStart) {
            const container = getCharacterContainer(str, i, RegularUtils.symbols.setEnd);
            characters.push({
               text: container,
               context: "set"
            });
            i += container.length + 1;
         } else {
            characters.push({
               text: str[i],
               context: "character"
            });
         }
      }

      return this.fixRegularCharacterBases(characters);
   }

   private static fixRegularCharacterBases(input: RegularCharacterBase[]): RegularCharacterBase[] {
      const output: RegularCharacterBase[] = [];

      input.forEach(base => {
         switch (base.context) {
            case "character":
               output.push(base);
               return;
            case "group":
               if (!RegularUtils.isReference(base.text)) {
                  output.push({
                     text: RegularUtils.symbols.wildcard,
                     context: "character"
                  });
               } else {
                  output.push(base);
               }
               return;
            case "set":
               const text = base.text
                  .split("")
                  .filter(c => LetterUtils.is("letter", c))
                  .join("");
               output.push({
                  text,
                  context: text.length === 1 ? "character" : "set"
               });
               return;
         }
      });

      return output;
   }

   private static fixReferences(input: RegularCharacterBase[]): RegularCharacterBase[] {
      const referenceRegularChars: RegularCharacterBase[] = [];
      const referencingSets: Set<number>[] = [];

      for (let i = 0; i < input.length; i++) {
         referencingSets[i] = new Set();
      }
      for (let i = 0; i < input.length; i++) {
         const base = input[i];

         if (RegularUtils.isReference(base.text, false)) {
            const referenceTo = Number(base.text);
            if (referenceTo === i || referenceTo >= input.length || referenceTo < 0) {
               referenceRegularChars.push({
                  text: RegularUtils.symbols.wildcard,
                  context: "character"
               });
               continue;
            } else {
               if (referenceTo > i) {
                  referencingSets[referenceTo].add(i);
               } else {
                  referencingSets[i].add(referenceTo);
               }
            }
         }

         referenceRegularChars.push(base);
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
      const output: RegularCharacterBase[] = [];
      for (let i = 0; i < referenceRegularChars.length; i++) {
         if (RegularUtils.isReference(referenceRegularChars[i].text, false)) {
            const text = String(referencingNumbers[i] ?? RegularUtils.symbols.wildcard);
            output.push({
               text,
               context: text === RegularUtils.symbols.wildcard ? "character" : "group"
            });
         } else if (referencingNumbers[i] === undefined) {
            output.push(referenceRegularChars[i]);
         } else {
            const letterToReference = referenceRegularChars[i];
            let idx = i;
            while (referencingNumbers[idx] !== undefined) {
               idx = referencingNumbers[idx]!;
            }
            output[idx] = letterToReference;
            output.push({
               text: String(referencingNumbers[i]),
               context: "group"
            });
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

   public match(other: string | RegularString, startIndex = 0): string[] {
      const matchingErrorMessages: string[] = [];
      const regularOther = typeof other === "string" ? new RegularString(other) : other;

      if (regularOther.length > this.length + startIndex) {
         throw new Error("Matched ending's length is larger than the length of this!");
      }

      for (let i = 0; i < regularOther.length && i + startIndex < this.length; i++) {
         const char = this.characters[i + startIndex];
         const otherChar = regularOther.characters[i];
         if (!char.doesMatch(otherChar)) {
            matchingErrorMessages.push(
               `Character matching on position ${i + startIndex} failed! Try using less regular references for better custom matching!`
            );
            continue;
         }

         this.matchCharacter(
            i + startIndex,
            startIndex,
            otherChar,
            this.getMatchedCharacter(char.matchingCharacter, otherChar.matchingCharacter)
         );
      }

      return matchingErrorMessages;
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
         const other = c1 instanceof RegularLetterSet ? c2 : c1;
         set.match(other);
         return set;
      }

      return c1.priority >= c2.priority ? c1.clone() : c2.clone();
   }

   private matchCharacter(
      index: number,
      strIndexDifference: number,
      otherChar: RegularCharacter,
      matchedChar: RegularCharacter
   ): void {
      const characterToReplace = this.characters[index];

      if (otherChar instanceof RegularReference) {
         this.characters[index] = new RegularReference(otherChar.getReferenceIndex() + strIndexDifference, false);
      } else if (characterToReplace instanceof RegularReference) {
         this.characters[characterToReplace.getReferenceIndex()] = matchedChar;
      } else {
         this.characters[index] = matchedChar;
      }
   }
}
