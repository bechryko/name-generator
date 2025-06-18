import { LetterSet } from "@ngen-core/models/letter-set";

export interface GenerationConfig {
   minLength: number;
   maxLength: number;
   excludedLetters: LetterSet;
   includedLetters: LetterSet;
   ignoreVoicedUnvoicedPairs: boolean;
   regularNameStart: string;
   regularNameEnd: string;
   regularNameBase: string;
}
