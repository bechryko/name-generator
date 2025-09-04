interface ReferenceData {
   referenceIndex: number;
   isExternal: boolean;
}

export class RegularUtils {
   public static readonly symbols = {
      vowel: "+",
      consonant: "-",
      wildcard: "*",
      groupStart: "{",
      groupEnd: "}",
      setStart: "(",
      setEnd: ")"
   } as const;
   public static readonly modifierFlags = {
      externalReference: "e"
   } as const;

   public static isRegular(letter: string): boolean {
      return this.isBasicRegular(letter) || this.isReference(letter);
   }

   public static isBasicRegular(letter: string): boolean {
      return Object.values(this.symbols).includes(letter as any);
   }

   public static isReference(letter: string, externalFilter?: boolean): boolean {
      try {
         const { isExternal } = this.extractReferenceData(letter);
         return externalFilter === undefined || isExternal === externalFilter;
      } catch (_) {
         return false;
      }
   }

   public static extractReferenceData(base: string): ReferenceData {
      const isExternal = base.startsWith(this.modifierFlags.externalReference);
      if (isExternal) {
         base = base.substring(1);
      }

      const referenceIndex = Number(base);
      if (base === "" || isNaN(referenceIndex)) {
         throw new Error(`Invalid reference index: ${base}!`);
      }

      return { referenceIndex, isExternal };
   }
}
