import { LetterUtils, RegularUtils } from "@ngen-generation/core/utils";
import { RegularCharacterPriority } from "@ngen-shared/enums";

enum RegularCharacterType {
   LETTER,
   REGULAR,
   REFERENCE
}

export class RegularCharacter {
   private type!: RegularCharacterType;
   private letter!: string;

   constructor(character: string) {
      this.assign(character);
   }

   public assign(character: string) {
      character = character[0];

      if (RegularUtils.isReference(character)) {
         throw new Error("Basic regular character cannot be a reference!");
      } else if (RegularUtils.isBasicRegular(character)) {
         this.type = RegularCharacterType.REGULAR;
      } else {
         this.type = RegularCharacterType.LETTER;
      }
      this.letter = character;
   }

   public doesMatch(character: RegularCharacter): boolean {
      if (this.isWildcard || character.isWildcard) {
         return true;
      }

      if (this.getValue() === character.getValue()) {
         return true;
      }

      if (this.type === character.type) {
         return false;
      }

      const [regular, letter] = this.type === RegularCharacterType.REGULAR ? [this, character] : [character, this];
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
      switch (this.type) {
         case RegularCharacterType.REGULAR:
            if (this.letter === RegularUtils.symbols.wildcard) {
               return RegularCharacterPriority.WILDCARD;
            } else {
               return RegularCharacterPriority.OTHER_BASIC_REGULAR;
            }
         case RegularCharacterType.LETTER:
            return RegularCharacterPriority.LETTER;
      }

      throw new Error(`Unknown type for regular character: ${this.type}`);
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
}
