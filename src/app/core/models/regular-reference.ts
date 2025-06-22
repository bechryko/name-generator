import { RegularCharacterPriority } from "@ngen-core/enums";
import { RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";
import { RegularCharacter } from "./regular-character";
import { RegularString } from "./regular-string";

export class RegularReference extends RegularCharacter {
   private referenceIndex!: number;
   private regularString?: RegularString;

   constructor(referenceIndex: number) {
      super(String(referenceIndex));
   }

   public override assign(character: string): void {
      character = character[0];

      if (!RegularUtils.isReference(character)) {
         throw new Error(`Invalid reference: ${character}`);
      }

      this.referenceIndex = Number(character);
   }

   public assignRegularString(regularString: RegularString): void {
      this.regularString = regularString;
   }

   public override get isReference(): boolean {
      return true;
   }

   public override get priority(): number {
      return RegularCharacterPriority.REFERENCE;
   }

   public override toString(): string {
      return String(this.referenceIndex);
   }

   public override getValue(): string {
      return this.dereference();
   }

   public override clone(): RegularReference {
      return new RegularReference(this.referenceIndex);
   }

   private dereference(): string {
      if (!this.regularString) {
         throw new Error("Cannot dereference without an assigned regular string!");
      }

      return this.regularString.getCharacters()[this.referenceIndex].toString();
   }
}
