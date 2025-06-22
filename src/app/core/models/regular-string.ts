import { RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { RegularCharacter } from "./regular-character";
import { RegularReference } from "./regular-reference";

export class RegularString {
   private readonly characters: RegularCharacter[] = [];

   constructor(str?: string) {
      if (!str) {
         return;
      }

      this.characters.push(...RegularUtils.parseStringToRegularCharacters(str));
      this.assignReferences();
   }

   public append(str: string | RegularString): void {
      const regular = typeof str === "string" ? new RegularString(str) : str;
      this.characters.push(...regular.characters);
      this.assignReferences();
   }

   public substring(start: number, end?: number): RegularString {
      return new RegularString(this.toRawString().substring(start, end));
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
               `Cannot match '${regularOther.toRawString()}' to '${this.toRawString()}' from position ${startIndex}!`
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
      return this.characters.map(c => c.getValue()).join("");
   }

   public toRawString(): string {
      return this.characters.map(c => c.toString()).join("");
   }

   public clone(): RegularString {
      return new RegularString(this.toRawString());
   }

   private assignReferences(): void {
      this.characters.forEach(char => {
         if (char instanceof RegularReference) {
            char.assignRegularString(this);
         }
      });
   }
}
