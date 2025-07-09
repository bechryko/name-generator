import { RegularUtils } from "@ngen-generation/core/utils";
import { RegularCharacterPriority } from "@ngen-shared/enums";
import { RegularCharacter } from "./regular-character";
import { RegularString } from "./regular-string";

export class RegularReference extends RegularCharacter {
   private regularString?: RegularString;

   constructor(private referenceIndex: number) {
      super("");
   }

   public override assign(character: string): void {
      character = character[0];

      if (!RegularUtils.isReference(character)) {
         return;
      }

      this.referenceIndex = Number(character);
   }

   public assignRegularString(regularString: RegularString): boolean {
      if (this.regularString) {
         const newIndexInOld = regularString.toString().indexOf(this.regularString.toString());
         if (newIndexInOld !== -1) {
            this.referenceIndex += newIndexInOld;
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
      if (this.referenceIndex >= 10) {
         return `{${this.referenceIndex}}`;
      }
      return String(this.referenceIndex);
   }

   public override getValue(): string {
      return this.dereference();
   }

   public override clone(): RegularReference {
      const newRef = new RegularReference(this.referenceIndex);
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
