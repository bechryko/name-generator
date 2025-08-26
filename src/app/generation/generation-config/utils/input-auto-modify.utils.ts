export class InputAutoModifyUtils {
   public static readonly LETTER_SET_MESSAGE =
      "Duplicate and invalid characters deleted from letter set. Alphabetical order ensured";
   public static readonly REGULAR_STRING_MESSAGE =
      "Invalid expressions, characters and syntax errors deleted and corrected in regular string. For more info, see About page, Generators subpage";
   public static readonly MIN_MAX_LENGTH_MIN_MESSAGE = "Minimum length cannot be more than Maximum length";
   public static readonly MIN_MAX_LENGTH_MAX_MESSAGE = "Maximum length cannot be less than Minimum length";

   public static getMinimumLengthMessage(minBound: number): string {
      return `Minimum length cannot be less than ${minBound}`;
   }

   public static getMaximumLengthMessage(maxBound: number): string {
      return `Maximum length cannot be more than ${maxBound}`;
   }
}
