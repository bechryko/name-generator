import { LetterUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";

export class LetterSet {
   private static deleteNonLetters(input: string): string {
      let output = "";
      for (let i = 0; i < input.length; i++) {
         if (LetterUtils.is("letter", input[i])) {
            output += input[i];
         }
      }
      return output;
   }

   private static deleteDuplicateCharacters(input: string): string {
      let output = "";
      for (let i = 0; i < input.length; i++) {
         if (!output.includes(input[i])) {
            output += input[i];
         }
      }
      return output;
   }

   private static sortCharacters(input: string): string {
      return input.split("").sort().join("");
   }

   private readonly innerSet: Set<string>;

   constructor(letters?: string) {
      if (!letters) {
         this.innerSet = new Set();
         return;
      }

      letters = letters.toLowerCase();
      letters = LetterSet.deleteNonLetters(letters);
      letters = LetterSet.deleteDuplicateCharacters(letters);
      letters = LetterSet.sortCharacters(letters);
      this.innerSet = new Set(letters.split(""));
   }

   public add(letter: string): void {
      const parsedLetter = LetterSet.deleteNonLetters(letter);
      if (letter.length !== 1 || parsedLetter.length !== 1) {
         throw new Error(`'${letter}' is not a letter`);
      }

      this.innerSet.add(letter);
   }

   public isEmpty(): boolean {
      return this.innerSet.size === 0;
   }

   public has(letter: string): boolean {
      if (letter.length !== 1) {
         return false;
      }

      return this.innerSet.has(letter);
   }

   public includesLetterFrom(letterContainer: string): boolean {
      return letterContainer.split("").some(letter => this.innerSet.has(letter));
   }

   public toString(): string {
      const letters = new Array(...this.innerSet);
      return letters.sort().join("");
   }
}
