import { getCharacterContainer } from "@ngen-shared/functions";
import { RegularCharacter, RegularLetterSet, RegularReference } from "@ngen-shared/models";
import { LetterUtils } from "./letter.utils";

interface ReferenceData {
   referenceIndex: number;
   isExternal: boolean;
}

export class RegularUtils {
   public static readonly symbols = {
      vowel: "+",
      consonant: "-",
      wildcard: "*",
      groupStart: "{",
      groupEnd: "}",
      setStart: "(",
      setEnd: ")"
   } as const;
   public static readonly modifierFlags = {
      externalReference: "e"
   } as const;

   public static isRegular(letter: string): boolean {
      return this.isBasicRegular(letter) || this.isReference(letter);
   }

   public static isBasicRegular(letter: string): boolean {
      return Object.values(this.symbols).includes(letter as any);
   }

   public static isReference(letter: string, externalFilter?: boolean): boolean {
      try {
         const { isExternal } = this.extractReferenceData(letter);
         return externalFilter === undefined || isExternal === externalFilter;
      } catch (_) {
         return false;
      }
   }

   public static extractReferenceData(base: string): ReferenceData {
      const isExternal = base.startsWith(this.modifierFlags.externalReference);
      if (isExternal) {
         base = base.substring(1);
      }

      const referenceIndex = Number(base);
      if (base === "" || isNaN(referenceIndex)) {
         throw new Error(`Invalid reference index: ${base}!`);
      }

      return { referenceIndex, isExternal };
   }

   public static parseStringToRegularCharacters(str: string): RegularCharacter[] {
      const parsedString = this.deleteNonRegulars(str.toLowerCase());
      const regularCharacterBases = this.splitToRegularCharacterBases(parsedString);
      const regularCharacterBasesWithFixedReferences = this.fixReferences(regularCharacterBases);
      return regularCharacterBasesWithFixedReferences.map(char => {
         if (this.isReference(char)) {
            const { referenceIndex, isExternal } = this.extractReferenceData(char);
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

   private static splitToRegularCharacterBases(str: string): string[] {
      const characters: string[] = [];

      for (let i = 0; i < str.length; i++) {
         if (str[i] === this.symbols.groupStart) {
            const container = getCharacterContainer(str, i, this.symbols.groupEnd);
            characters.push(container);
            i += container.length + 1;
         } else if (str[i] === this.symbols.setStart) {
            const container = getCharacterContainer(str, i, this.symbols.setEnd);
            characters.push(container);
            i += container.length + 1;
         } else {
            characters.push(str[i]);
         }
      }

      return characters;
   }
}
