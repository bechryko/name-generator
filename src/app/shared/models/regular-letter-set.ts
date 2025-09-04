import { RegularCharacterMatchingPriority } from "../enums";
import { LetterUtils, RandomUtils, RegularUtils } from "../utils";
import { RegularCharacter } from "./regular-character";

export class RegularLetterSet extends RegularCharacter {
   public static match(regular1: RegularLetterSet, regular2: RegularLetterSet): RegularLetterSet {
      const matchingCharacters = regular1.set.filter(char1 => regular2.has(char1));
      return new RegularLetterSet(matchingCharacters);
   }

   private set: RegularCharacter[];

   constructor(characters: RegularCharacter[]) {
      super("");

      this.set = [];
      characters.forEach(char => {
         if (!this.set.find(c => c.equals(char))) {
            this.set.push(char);
         }
      });
      this.set = this.set.sort((c1, c2) => this.compareCharacters(c1, c2));
   }

   public override assign(character: string): void {}

   public override doesMatch(character: RegularCharacter): boolean {
      if (character.isWildcard) {
         return true;
      }

      if (character.isReference) {
         return this.has(character.getValue());
      }

      if (LetterUtils.is("letter", character.toString())) {
         return this.has(character);
      }

      if (character.toString() === RegularUtils.symbols.vowel) {
         return this.isVowel;
      }

      if (character.toString() === RegularUtils.symbols.consonant) {
         return this.isConsonant;
      }

      if (character instanceof RegularLetterSet) {
         for (const char of this.set) {
            if (character.has(char)) {
               return true;
            }
         }
      }

      return false;
   }

   public match(char: RegularCharacter): void {
      if (char.isWildcard) {
         return;
      }

      if (char.isReference || LetterUtils.is("letter", char.toString())) {
         this.set = [char.clone()];
         return;
      }

      if (char.isVowel) {
         this.set = this.set.filter(c => c.isVowel);
         return;
      }

      if (char.isConsonant) {
         this.set = this.set.filter(c => c.isConsonant);
         return;
      }

      throw new Error(`Unknown character type to be matched for regular letter set : '${char.toString()}'`);
   }

   public override get isVowel(): boolean {
      return this.set.some(char => char.isVowel);
   }

   public override get isConsonant(): boolean {
      return this.set.some(char => char.isConsonant);
   }

   public override get isWildcard(): boolean {
      return this.isVowel && this.isConsonant;
   }

   public override get matchingPriority(): number {
      return RegularCharacterMatchingPriority.LETTER_SET;
   }

   public override toString(): string {
      const setAsString = this.set.map(char => char.toString()).join("");
      return `(${setAsString})`;
   }

   public override getValue(): string {
      return RandomUtils.randomIndex(this.set).getValue();
   }

   public override clone(): RegularLetterSet {
      return new RegularLetterSet(this.set.map(char => char.clone()));
   }

   public override equals(other: unknown): boolean {
      if (!(other instanceof RegularLetterSet)) {
         return false;
      }
      if (other.set.length !== this.set.length) {
         return false;
      }
      return this.set.every((char, index) => other.set[index].equals(char));
   }

   private compareCharacters(c1: RegularCharacter, c2: RegularCharacter): number {
      return c1.toString().localeCompare(c2.toString());
   }

   private has(character: RegularCharacter | string): boolean {
      if (typeof character === "string") {
         return Boolean(this.set.find(char => char.toString() === character));
      }
      return Boolean(this.set.find(char => char.equals(character)));
   }
}
