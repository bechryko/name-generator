import { RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";

/**
 * A class to represent regular forms of a name and handle its references.
 */
export class RegularNameObject {
   public referenceRegular: string;
   public readonly references: number[] = []; //TODO: make these private

   constructor(regular: string) {
      this.referenceRegular = this.extractReferences(regular);
   }

   public append(regular: string | RegularNameObject): RegularNameObject {
      if(typeof regular === 'string') {
         this.referenceRegular += regular;
      } else {
         const oldLength = this.length;
         this.referenceRegular += regular.referenceRegular;
         for(let i = 0; i < regular.references.length; i++) {
            this.references[oldLength + i] = regular.references[i] + oldLength;
         }
      }
      return this;
   }

   public overrideEnding(ending: string): void {
      this.references.splice(this.referenceRegular.length - ending.length, ending.length);
      this.referenceRegular = this.referenceRegular.substring(0, this.referenceRegular.length - ending.length) + ending;
   }

   public valueOf(): string {
      let regular = "";
      for(let i = 0; i < this.referenceRegular.length; i++) {
         if(this.referenceRegular[i] === RegularUtils.symbols.reference) {
            regular += this.references[i];
         } else {
            regular += this.referenceRegular[i];
         }
      }
      return regular;
   }

   public copy(): RegularNameObject {
      const copy = new RegularNameObject(this.valueOf());
      return copy;
   }

   public get length(): number {
      return this.referenceRegular.length;
   }

   private extractReferences(regular: string): string {
      let referenceRegular = "";
      for(let i = 0; i < regular.length; i++) {
         if(RegularUtils.isReference(regular[i])) {
            this.references[i] = Number(regular[i]);
            referenceRegular += RegularUtils.symbols.reference;
         } else {
            referenceRegular += regular[i];
         }
      }
      return referenceRegular;
   }
}
