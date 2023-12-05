import { RegularUtils } from "@ngen-generation/generator-algorithms/letter-finalization/utils";

export class RegularNameObject {
   public referenceRegular: string;
   public readonly references: number[] = [];

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
