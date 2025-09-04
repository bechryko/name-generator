import { RegularCharacterPriority } from "../enums";
import { RegularUtils } from "../utils";
import { RegularCharacter } from "./regular-character";
import { RegularString } from "./regular-string";

export class RegularReference extends RegularCharacter {
   private regularString?: RegularString;

   constructor(
      private referenceIndex: number,
      private isExternal: boolean
   ) {
      super("");
   }

   public override assign(character: string): void {
      if (!RegularUtils.isReference(character)) {
         return;
      }

      this.referenceIndex = Number(character);
   }

   public assignRegularString(regularString: RegularString): boolean {
      if (this.regularString) {
         const newIndexInOld = regularString.toString().indexOf(this.regularString.toString());
         if (newIndexInOld !== -1) {
            if (!this.isExternal) {
               this.referenceIndex += newIndexInOld;
            }
         } else {
            return false;
         }
      }

      this.regularString = regularString;
      return true;
   }

   public override get isReference(): boolean {
      return true;
   }

   public override get priority(): number {
      return RegularCharacterPriority.REFERENCE;
   }

   public override toString(): string {
      let str = String(this.referenceIndex);

      if (this.isExternal) {
         str = RegularUtils.modifierFlags.externalReference + str;
      }

      return str.length === 1 ? str : `{${str}}`;
   }

   public override getValue(): string {
      return this.dereference();
   }

   public override clone(): RegularReference {
      const newRef = new RegularReference(this.referenceIndex, this.isExternal);
      if (this.regularString) {
         newRef.assignRegularString(this.regularString);
      }
      return newRef;
   }

   public override equals(other: unknown): boolean {
      throw new Error("Equality check not implemented for regular references!");
   }

   private dereference(): string {
      if (!this.regularString) {
         throw new Error("Cannot dereference without an assigned regular string!");
      }

      return this.regularString.getCharacters()[this.referenceIndex].toString();
   }
}
