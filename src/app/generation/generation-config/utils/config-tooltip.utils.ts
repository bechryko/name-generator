import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";

export class ConfigTooltipUtils {
   public static getMinLengthTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return `Minimum length in ${this.getGeneratorLengthTypeText(selectedGenerator)} (cannot be more than Maximum length)`;
   }

   public static getMaxLengthTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return `Maximum length in ${this.getGeneratorLengthTypeText(selectedGenerator)} (cannot be less than Minimum length)`;
   }

   public static getExcludedLettersTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return "Letters which will not appear in the name (cannot be used with Included letters)";
   }

   public static getIncludedLettersTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return "Only these letters will appear in the name (cannot be used with Excluded letters)";
   }

   public static getIgnoreVoicedUnvoicedPairsTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return "When checked, voiced-unvoiced pairs (for example k and g) can be neighbors in the name";
   }

   public static getRegularFieldTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return "Uses special regular language (you can read about it on the about page). Can override set length";
   }

   public static getSyllableAlleviationTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return "Balances the syllable lengths";
   }

   public static getDisableLetterWeightsTooltip(selectedGenerator: GeneratorAlgorithmName): string {
      return "When checked, every letter can appear with the same chance. Useful when only a small set of letters is included, and their frequencies differ by a lot";
   }

   private static getGeneratorLengthTypeText(generator: GeneratorAlgorithmName): string {
      switch (generator) {
         case GeneratorAlgorithmName.JAPANESE:
            return "Japanese letters";
         case GeneratorAlgorithmName.REGULAR:
            return "letters";
         case GeneratorAlgorithmName.SYLLABIC:
            return "syllables";
      }
   }
}
