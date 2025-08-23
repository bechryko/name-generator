import { LetterUtils, RegularUtils } from "@ngen-generation/core/utils";
import { RegularCharacterMatchingPriority, RegularCharacterPriority } from "@ngen-shared/enums";

export class RegularCharacter {
   private letter!: string;
   private isBasicRegular = false;

   constructor(character: string) {
      this.assign(character);
   }

   public assign(character: string) {
      character = character[0];

      if (RegularUtils.isReference(character)) {
         throw new Error("Basic regular character cannot be a reference!");
      } else {
         this.isBasicRegular = RegularUtils.isBasicRegular(character);
      }
      this.letter = character;
   }

   public doesMatch(character: RegularCharacter): boolean {
      if (character.matchingPriority > this.matchingPriority) {
         return character.doesMatch(this);
      }

      if (this.isWildcard || character.isWildcard) {
         return true;
      }

      if (this.getValue() === character.getValue()) {
         return true;
      }

      if (this.isBasicRegular === character.isBasicRegular) {
         return false;
      }

      const [regular, letter] = this.isBasicRegular ? [this, character] : [character, this];
      return regular.isVowel
         ? LetterUtils.is("vowel", letter.getValue())
         : LetterUtils.is("consonant", letter.getValue());
   }

   public get isVowel(): boolean {
      return this.getValue() === RegularUtils.symbols.vowel || LetterUtils.is("vowel", this.getValue());
   }

   public get isConsonant(): boolean {
      return this.getValue() === RegularUtils.symbols.consonant || LetterUtils.is("consonant", this.getValue());
   }

   public get isWildcard(): boolean {
      return this.getValue() === RegularUtils.symbols.wildcard;
   }

   public get isReference(): boolean {
      return false;
   }

   public get priority(): number {
      if (this.isBasicRegular) {
         if (this.letter === RegularUtils.symbols.wildcard) {
            return RegularCharacterPriority.WILDCARD;
         } else {
            return RegularCharacterPriority.OTHER_BASIC_REGULAR;
         }
      }
      return RegularCharacterPriority.LETTER;
   }

   public get matchingPriority(): number {
      return RegularCharacterMatchingPriority.DEFAULT;
   }

   public toString(): string {
      return this.letter;
   }

   public getValue(): string {
      return this.toString();
   }

   public clone(): RegularCharacter {
      return new RegularCharacter(this.toString());
   }

   public equals(other: unknown): boolean {
      if (!(other instanceof RegularCharacter)) {
         return false;
      }

      return this.isBasicRegular === other.isBasicRegular && this.letter === other.letter;
   }
}
