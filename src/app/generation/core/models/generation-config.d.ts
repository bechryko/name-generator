import { LetterSet, RegularString } from "@ngen-shared/models";

export interface GenerationConfig {
   minLength: number;
   maxLength: number;
   excludedLetters: LetterSet;
   includedLetters: LetterSet;
   ignoreVoicedUnvoicedPairs: boolean;
   regularNameStart: RegularString;
   regularNameEnd: RegularString;
   regularNameBase: RegularString;
   syllableAlleviation: boolean;
   disableLetterWeights: boolean;
}
