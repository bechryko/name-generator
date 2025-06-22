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

   public getCharacters(clone = false): RegularCharacter[] {
      if (clone) {
         return this.characters.map(c => c.clone());
      }
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
      this.characters.forEach((char, index) => {
         if (char instanceof RegularReference) {
            const success = char.assignRegularString(this);
            if (!success) {
               this.characters[index] = new RegularCharacter(char.getValue());
            }
         }
      });
   }
}
