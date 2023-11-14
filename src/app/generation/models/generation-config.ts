export interface GenerationConfig {
   minLength: number;
   maxLength: number;
   excludedLetters: string;
   includedLetters: string;
   ignoreVoicedUnvoicedPairs: boolean;
   regularNameStart: string;
   regularNameEnd: string;
   regularNameBase: string;
}
