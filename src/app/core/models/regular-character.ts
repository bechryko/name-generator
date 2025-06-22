import { RegularCharacterPriority } from "@ngen-core/enums";
import { LetterUtils, RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";

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
      if (this.letter === RegularUtils.symbols.wildcard || character.letter === RegularUtils.symbols.wildcard) {
         return true;
      }

      if (this.isReference || character.isReference) {
         // TODO: make the references know more about the character they are referencing
         return false;
      }

      if (this.letter === character.letter) {
         return true;
      }

      if (this.type === character.type) {
         return false;
      }

      const [regular, { letter }] = this.type === RegularCharacterType.REGULAR ? [this, character] : [character, this];
      return regular.letter === RegularUtils.symbols.vowel
         ? LetterUtils.is("vowel", letter)
         : LetterUtils.is("consonant", letter);
   }

   public get isVowel(): boolean {
      return this.letter === RegularUtils.symbols.vowel || LetterUtils.is("vowel", this.letter);
   }

   public get isConsonant(): boolean {
      return this.letter === RegularUtils.symbols.consonant || LetterUtils.is("consonant", this.letter);
   }

   public get isWildcard(): boolean {
      return this.letter === RegularUtils.symbols.wildcard;
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
